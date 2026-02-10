// backend/src/controllers/user_management/inviteUserController.ts
import { db } from "../../database/db.js";
import { usersTable } from "../../schema/user_management/invite_user_schema.js";
import { createOrganization } from "../../schema/schema.js";
import type { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";
import emailConfig from "../../functions/emailconfig.js";

/** Capitalize first letter of each word (e.g. "system admin" -> "System Admin"). */
function capitalizeFirstLetter(str: string): string {
  if (!str || typeof str !== "string") return str;
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const inviteUser = async (req: Request, res: Response) => {
  const BASE_URL = process.env.BASE_URL;
  // Helper to generate email HTML (inline styles for reliable font color in email clients e.g. Chrome)
  function userEmailTemplate(
    email: string,
    organizationName: string,
    role: string,
    confirmationLink: string,
    user: string,
  ) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to AI Eval</title>
<style>
  body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; color:#333333; }
  .container { max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border-radius: 8px; color:#333333; }
  h1 { color: #2463eb; }
  p { font-size:16px; line-height:1.5; color:#333333; }
  .button-container { margin:20px 0; }
  .confirm-button { background-color: #2463eb; color:#ffffff; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold; }
  .footer { font-size:12px; color:#666666; margin-top:20px; text-align:center; }
</style>
</head>
<body style="font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; color:#333333;">
<div class="container" style="max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border-radius: 8px; color:#333333;">
  <h1 style="color: #2463eb;">Welcome to AI Eval!</h1>
  <p style="font-size:16px; line-height:1.5; color:#333333;">Hello,</p>
  <p style="font-size:16px; line-height:1.5; color:#333333;">You've been invited to join <strong>AI Eval</strong> as a <strong>${role}</strong> in <strong>${organizationName}</strong>. Please confirm your email address to activate your account and set your password.</p>
  <div class="button-container" style="margin:20px 0;">
    <a href="${confirmationLink}" class="confirm-button" style="background-color: #2463eb; color:#ffffff; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold;">Confirm Email</a>
  </div>
  <p style="font-size:16px; line-height:1.5; color:#333333;">If you did not request this invitation, you can safely ignore this email.</p>
  <p style="font-size:16px; line-height:1.5; color:#333333;">Thanks,<br>The AI Eval Team</p>
  <div class="footer" style="font-size:12px; color:#666666; margin-top:20px; text-align:center;">&copy; 2026 AI Eval. All rights reserved.</div>
</div>
</body>
</html>`;
  }

  try {
    let { email, organization, role, user } = req.body;

    if (!email || !organization || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    email = email.toLowerCase();

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Resolve organization ID to organization name (for display and DB)
    let organizationName: string;
    if (organization === "AI EVAL") {
      organizationName = "AI EVAL";
    } else {
      const orgRows = await db
        .select({ organizationName: createOrganization.organizationName })
        .from(createOrganization)
        .where(eq(createOrganization.id, Number(organization)))
        .limit(1);
      organizationName = orgRows[0]?.organizationName ?? String(organization);
    }

    // Each organization may have only one admin; reject inviting a second admin for the same org
    if (String(role).toLowerCase().trim() === "admin") {
      const existingAdmin = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.organization_name, organizationName),
            eq(usersTable.role, "admin"),
          ),
        )
        .limit(1);
      if (existingAdmin.length > 0) {
        return res.status(400).json({
          message:
            "This organization already has an admin. Only one admin per organization is allowed.",
        });
      }
    }

    // When system admin invites to AI EVAL, store the selected system role (system admin, system user, system manager, system viewer)
    const systemRoles = [
      "system admin",
      "system user",
      "system manager",
      "system viewer",
    ];
    let platform_role: string;
    if (
      organization === "AI EVAL" &&
      role &&
      systemRoles.includes(String(role).toLowerCase().trim())
    ) {
      platform_role = String(role).toLowerCase().trim();
    } else if (organization === "AI EVAL") {
      platform_role = "system admin";
    } else {
      platform_role = "";
    }

    await db.insert(usersTable).values({
      email,
      organization_name: organizationName,
      role,
      invited_at: new Date(),
      account_status: "invited",
      invited_by: user,
      user_platform_role: platform_role,
    });

    console.log("User inserted successfully into DB:", email);

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error("JWT_SECRET_KEY not set");
    const token = jwt.sign({ email }, secret, { expiresIn: "7d" });

    const confirmationLink = `${BASE_URL}/signup/${token}`;

    const transporter = emailConfig();

    const organizationNameCapitalized = capitalizeFirstLetter(organizationName);
    const roleCapitalized = capitalizeFirstLetter(role);

    await transporter.sendMail({
      from: {
        name: "AI_Eval",
        address: process.env.SENDER_EMAIL ?? "noreply@aieval.example.com",
      },
      to: email,
      subject: "Confirm your AI Eval account",
      html: userEmailTemplate(
        email,
        organizationNameCapitalized,
        roleCapitalized,
        confirmationLink,
        user,
      ),
    });

    console.log("Invitation email sent to:", email);

    return res.status(201).json({ message: "User invited successfully" });
  } catch (err: any) {
    console.error("Error in /invite_user:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const fetchUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = db.select().from(usersTable);
    res.status(200).json(allUsers);
  } catch (err: any) {
    console.error("error", err.msg);
    res.status(200).json({ message: "Server error", error: err.message });
  }
};
