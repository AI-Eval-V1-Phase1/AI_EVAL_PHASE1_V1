import type { Request, Response } from "express";
import { db } from "../../database/db";
import { eq } from "drizzle-orm";
import { userEditLogs, usersTable } from "../../schema/schema";

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

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, emailLower));

    if (existingUser.length > 0 && existingUser[0].id !== user_Id) {
      return res.status(400).json({
        success: false,
        message: "Email already exists for another user",
      });
    }

 
    const updateOrg = await db
      .update(usersTable)
      .set({
        email: emailLower,
        organization_name: data.organization,
        role: data.role,
        userStatus: data.isStatus,
      })
      .where(eq(usersTable.id, user_Id));

 
    const userLogs = await db.insert(userEditLogs).values({
      userId: data.userId,           
      email:emailLower,
      organizationName: data.organization,
      userStatus: data.isStatus,
      updated_by: data.userId,    
      reason: data.isReason,
    });

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
