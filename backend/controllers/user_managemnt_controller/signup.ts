import { eq } from "drizzle-orm";
import { db } from "../../database/db";
import type { Request, Response } from "express";
import { usersTable } from "../../schema/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailConfig from "../../functions/emailconfig";

const userSignup = async (req: Request, res: Response) => {
  const userData = req.body;

  const email = userData.email.toLowerCase();

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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.newPassword, saltRounds);

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user[0].user_signup_completed === "true") {
      return res.status(409).json({ message: "Signup already completed" });
    }

    const updatedUser = await db
      .update(usersTable)
      .set({
        email: email,
        user_first_name: userData.firstName,
        user_last_name: userData.lastName,
        user_name: userData.userName,
        user_password: hashedPassword,
        account_status: "confirmed",
        user_signup_completed: "true",
      })
      .where(eq(usersTable.email, email));

    const updatedDbUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    const dbUser = updatedDbUser[0];
    const userId = dbUser.id;

    const token = jwt.sign({ email, userId }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "7d",
    });

    // console.log("dbUser",dbUser)
    const onboardingLink = `http://localhost:5173/onboarding/${token}`;

    const transporter = emailConfig();

    await transporter.sendMail({
      from: {
        name: "AI_Eval",
        address: process.env.SENDER_EMAIL,
      },
      to: email,
      subject: "Onboarding in AI Eval",
      html: userEmailTemplate(
        dbUser.user_name,
        dbUser.role,
        onboardingLink,
        dbUser.organization_name,
      ),
    });

    console.log("Onboarding email sent to:", email);

    res.status(201).json({ message: "User signup successful", token, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default userSignup;
