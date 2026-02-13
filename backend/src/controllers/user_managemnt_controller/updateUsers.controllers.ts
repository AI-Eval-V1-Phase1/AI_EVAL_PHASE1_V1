import type { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { db } from "../../database/db.js";
import { eq } from "drizzle-orm";
import { createOrganization, userEditLogs, usersTable } from "../../schema/schema.js";
import emailConfig from "../../functions/emailconfig.js";


/** HTML email for signup confirmation (invite or reactivation). */
function signupConfirmationEmailHtml(
  organizationName: string,
  role: string,
  confirmationLink: string,
) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AI Eval - Confirm your account</title></head>
<body style="font-family: Arial, sans-serif; margin:0; padding:0; background:#f4f6f8; color:#333333;">
<div style="max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border-radius: 8px; color:#333333;">
  <h1 style="color: #2463eb;">Welcome to AI Eval!</h1>
  <p style="font-size:16px; line-height:1.5;">Your account has been activated. Please confirm your email to access the portal and set your password if needed.</p>
  <p style="font-size:16px; line-height:1.5;">You are registered as <strong>${role}</strong> in <strong>${organizationName}</strong>.</p>
  <div style="margin:20px 0;">
    <a href="${confirmationLink}" style="background-color: #2463eb; color:#ffffff; padding:14px 28px; border-radius:6px; text-decoration:none; font-weight:bold;">Confirm Email</a>
  </div>
  <p style="font-size:16px; line-height:1.5;">Thanks,<br>The AI Eval Team</p>
</div>
</body>
</html>`;
}

const updatesUsers = async (req: Request, res: Response) => {
  const data = req.body;
  const user_Id = Number(req.params.id);

  if (!user_Id) {
    return res.status(400).json({
      success: false,
      message: "Invalid User id",
    });
  }

  try {
    const emailLower = data.email.toLowerCase();
    const organizationId = Number(data.organization);
    if (!Number.isInteger(organizationId) || organizationId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid organization",
      });
    }

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, emailLower));

    const conflictUser = existingUser[0];
    if (existingUser.length > 0 && conflictUser !== undefined && conflictUser.id !== user_Id) {
      return res.status(400).json({
        success: false,
        message: "Email already exists for another user",
      });
    }

     const currentUser = await db
      .select({ userStatus: usersTable.userStatus })
      .from(usersTable)
      .where(eq(usersTable.id, user_Id))
      .limit(1);
    const previousStatus = String(currentUser[0]?.userStatus ?? "").trim().toLowerCase();

    const [orgRow] = await db
      .select({ organizationName: createOrganization.organizationName })
      .from(createOrganization)
      .where(eq(createOrganization.id, organizationId))
      .limit(1);
    const organizationNameForLog = orgRow?.organizationName ?? String(organizationId);

    await db
      .update(usersTable)
      .set({
        email: emailLower,
        organization_id: organizationId,
        role: data.role,
        userStatus: data.isStatus,
      })
      .where(eq(usersTable.id, user_Id));

    await db.insert(userEditLogs).values({
      userId: data.userId,
      email: emailLower,
      organizationName: organizationNameForLog,
      userStatus: data.isStatus,
      updated_by: data.userId,
      reason: data.isReason,
    });

    const newStatus = String(data.isStatus ?? "").trim().toLowerCase();
    if (previousStatus === "inactive" && newStatus === "active") {
      const BASE_URL = process.env.BASE_URL;
      const secret = process.env.JWT_SECRET_KEY;
      if (secret && BASE_URL) {
        try {
          const token = jwt.sign({ email: emailLower }, secret, { expiresIn: "7d" });
          const confirmationLink = `${BASE_URL}/signup/${token}`;
          const transporter = emailConfig();
          await transporter.sendMail({
            from: {
              name: "AI_Eval",
              address: process.env.SENDER_EMAIL ?? "noreply@aieval.example.com",
            },
            to: emailLower,
            subject: "Your AI Eval account has been reactivated – Confirm your email",
            html: signupConfirmationEmailHtml(
              data.organization ?? "",
              data.role ?? "",
              confirmationLink,
            ),
          });
        } catch (emailErr) {
          console.error("Reactivation confirmation email failed:", emailErr);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

export default updatesUsers;
