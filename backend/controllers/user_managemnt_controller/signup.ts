import { and, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "../../database/db.js";
import type { Request, Response } from "express";
import { createOrganization, usersTable } from "../../schema/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailConfig from "../../functions/emailconfig.js";

const userSignup = async (req: Request, res: Response) => {
  const userData = req.body ?? {};
  const BASE_URL = process.env.BASE_URL;
  const emailFromBody = userData.email != null ? String(userData.email).trim() : "";
  const emailFromToken = (req as { email?: string }).email != null ? String((req as { email?: string }).email).trim() : "";
  const email = (emailFromBody || emailFromToken).toLowerCase();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  function userEmailTemplate(
    name: string,
    role: string,
    onboardingLink: string,
    organization: string,
  ) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to AI Eval!</title>
<style>
  body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; }
  .container { max-width: 600px; margin: 20px auto; padding: 30px; background: #fff; border-radius: 8px; }
  h1 { color: #1e3a8a; }
  p { font-size:16px; line-height:1.5; color:#333; }
  .button-container { margin:20px 0; }
  .login-button { background-color: #1e3a8a; color:white; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold; }
  .footer { font-size:12px; color:#888; margin-top:20px; text-align:center; }
</style>
</head>
<body>
<div class="container">
  <h1>Welcome to AI Eval, ${name}!</h1>
  <p>We're excited to have you join <strong>${organization}</strong> as a <strong>${role}</strong>.</p>
  <p>Your account has been successfully activated, and you can now access all the features of AI Eval.</p>
  <div class="button-container">
    <a href="${onboardingLink}" class="login-button">Go to Onboarding</a>
  </div>
  <p>Here are a few things you can do next:</p>
  <ul>
    <li>Set up your profile and preferences.</li>
    <li>Explore AI Eval features tailored for your role.</li>
    <li>Invite teammates to collaborate and evaluate efficiently.</li>
  </ul>
  <p>If you have any questions, feel free to reply to this email—we’re here to help!</p>
  <p>Cheers,<br>The AI Eval Team</p>
  <div class="footer">&copy; 2026 AI Eval. All rights reserved.</div>
</div>
</body>
</html>`;
  }

  try {
    const newPassword = userData.newPassword != null ? String(userData.newPassword) : "";
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password is required and must be at least 6 characters" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRow = user[0];
    if (!existingRow) {
      return res.status(404).json({ message: "User not found" });
    }
    if (existingRow.user_signup_completed === "true") {
      return res.status(409).json({ message: "Signup already completed" });
    }

    const orgName = existingRow.organization_name;
    const orgNameNormalized = String(orgName ?? "").trim().toLowerCase();
    const isAiEvalOrg = orgNameNormalized === "ai eval";

    // Get org's platform role: any user in this org who has user_platform_role set (first one found)
    const orgUsersWithRole = await db
      .select({ user_platform_role: usersTable.user_platform_role })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.organization_name, orgName),
          isNotNull(usersTable.user_platform_role),
          ne(usersTable.user_platform_role, ""),
        ),
      )
      .limit(1);

    let platformRoleToStore: string | null = null;
    if (isAiEvalOrg) {
      platformRoleToStore = "system admin";
    } else if (orgUsersWithRole.length > 0 && orgUsersWithRole[0]?.user_platform_role) {
      const raw = String(orgUsersWithRole[0].user_platform_role).trim().toLowerCase();
      if (raw === "vendor" || raw === "buyer" || raw === "system admin") {
        platformRoleToStore = raw;
      }
    }

    const signupUpdatePayload = {
      email,
      user_first_name: userData.firstName != null ? String(userData.firstName) : null,
      user_last_name: userData.lastName != null ? String(userData.lastName) : null,
      user_name: userData.userName != null ? String(userData.userName) : null,
      user_password: hashedPassword,
      account_status: "confirmed" as const,
      user_signup_completed: "true" as const,
      ...(platformRoleToStore != null ? { user_platform_role: platformRoleToStore } : {}),
    };

    await db
      .update(usersTable)
      .set(signupUpdatePayload)
      .where(eq(usersTable.email, email));

    const updatedDbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const dbUser = updatedDbUser[0];
    if (!dbUser) {
      return res.status(500).json({ message: "User not found after update" });
    }
    const userId = dbUser.id;
    const organizationId = dbUser.organization_name;

    // If any user in this organization has already completed onboarding, don't send onboarding email
    const orgOnboardedUsers = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.organization_name, dbUser.organization_name),
          eq(usersTable.user_onboarding_completed, "true"),
        ),
      )
      .limit(1);
    const isOrgOnboardingCompleted = orgOnboardedUsers.length > 0;

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error("JWT_SECRET_KEY not set");
    const token = jwt.sign({ email, userId, organizationId }, secret, {
      expiresIn: "1d",
    });

    // console.log("dbUser",dbUser)
    const onboardingLink = `${BASE_URL}/onboarding/${token}`;

    // Resolve organization display name for email (org name, not org id)
    const orgIdFromUser = dbUser.organization_name;
    const numericOrgId = Number(orgIdFromUser);
    let orgDisplayName = String(orgIdFromUser ?? "").trim();
    if (String(numericOrgId) === String(orgIdFromUser).trim() && !Number.isNaN(numericOrgId)) {
      const orgRows = await db
        .select({ organizationName: createOrganization.organizationName })
        .from(createOrganization)
        .where(eq(createOrganization.id, numericOrgId))
        .limit(1);
      if (orgRows.length > 0 && orgRows[0]?.organizationName) {
        orgDisplayName = orgRows[0].organizationName;
      }
    }

    if (!isOrgOnboardingCompleted) {
      const transporter = emailConfig();

      await transporter.sendMail({
        from: {
          name: "AI_Eval",
          address: process.env.SENDER_EMAIL ?? "noreply@aieval.example.com",
        },
        to: email,
        subject: "Onboarding in AI Eval",
        html: userEmailTemplate(
          dbUser.user_name ?? "User",
          dbUser.role,
          onboardingLink,
          orgDisplayName,
        ),
      });

      console.log("Onboarding email sent to:", email);

      // AI EVAL org: set platform role at signup even when org not yet onboarded
      if (platformRoleToStore != null) {
        await db
          .update(usersTable)
          .set({ user_platform_role: platformRoleToStore })
          .where(eq(usersTable.id, dbUser.id));
      }
    } else {
      await db
        .update(usersTable)
        .set({
          user_onboarding_completed: "true",
          ...(platformRoleToStore != null ? { user_platform_role: platformRoleToStore } : {}),
        })
        .where(eq(usersTable.id, dbUser.id));
      console.log(
        "Organization onboarding already completed. Onboarding email not sent for:",
        email,
      );
    }

    res.status(201).json({ message: "User signup successful", token, userId });
  } catch (error) {
    console.error("Signup error:", error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Internal server error", details: message });
  }
};

export default userSignup;
