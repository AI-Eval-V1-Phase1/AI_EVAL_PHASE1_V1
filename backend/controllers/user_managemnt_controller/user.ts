// backend/src/controllers/user_management/inviteUserController.ts
import { db } from "../../database/db";
import { usersTable } from "../../schema/user_management/invite_user_schema";
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { eq } from "drizzle-orm";
import { error } from "node:console";

export const inviteUser = async (req: Request, res: Response) => {
  // Helper to generate email HTML
  function userEmailTemplate(
    email: string,
    organization: string,
    role: string,
    confirmationLink: string,
  ) {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to AI Eval</title>
<style>
  body { font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; }
  .container { max-width: 600px; margin: 20px auto; padding: 30px; background: #fff; border-radius: 8px; }
  h1 { color: #1e3a8a; }
  p { font-size:16px; line-height:1.5; color:#333; }
  .button-container { margin:20px 0; }
  .confirm-button { background-color: #1e3a8a; color:white; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold; }
  .footer { font-size:12px; color:#888; margin-top:20px; text-align:center; }
</style>
</head>
<body>
<div class="container">
  <h1>Welcome to AI Eval!</h1>
  <p>Hello,</p>
  <p>You've been invited to join <strong>AI Eval</strong> as a <strong>${role}</strong> in <strong>${organization}</strong>. Please confirm your email address to activate your account and set your password.</p>
  <div class="button-container">
    <a href="${confirmationLink}" class="confirm-button">Confirm Email</a>
  </div>
  <p>If you did not request this invitation, you can safely ignore this email.</p>
  <p>Thanks,<br>The AI Eval Team</p>
  <div class="footer">&copy; 2026 AI Eval. All rights reserved.</div>
</div>
</body>
</html>`;
  }

  try {
    const { email, organization, role } = req.body;

    if (!email || !organization || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert user into DB


    await db.insert(usersTable).values({
      email,
      organization_name: organization, // match schema
      role,
      invited_at: new Date(),
      account_status: "invited",
    });

    console.log("User inserted successfully into DB:", email);

    // Generate confirmation link (replace with your frontend URL logic)
    const confirmationLink = `http://localhost:5173/onboarding?email=${encodeURIComponent(email)}`;

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env["SENDER_EMAIL"],
        pass: process.env["SENDER_PASSWORD"],
      },
    });

    // Send the invitation email
    await transporter.sendMail({
      from: {
        name: "AI_Eval",
        address: process.env["SENDER_EMAIL"],
      },
      to: email,
      subject: "Confirm your AI Eval account",
      html: userEmailTemplate(email, organization, role, confirmationLink),
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
