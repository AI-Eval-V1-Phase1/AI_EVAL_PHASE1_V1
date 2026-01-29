import { eq, exists } from "drizzle-orm";
import { db } from "../../database/db";
import type { Request, Response } from "express";
import { usersTable } from "../../schema/schema";
import bcrypt from "bcrypt";

const userSignup = async (req: Request, res: Response) => {
  const userData = req.body;
  console.log(userData);
  //   console.log(token);

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    try {
      const updateUser = await db
        .update(usersTable)
        .set({
          email: req.body.email,
          user_first_name: req.body.firstName,
          user_last_name: req.body.lastName,
          user_name: req.body.userName,
          user_password: hashedPassword,
          account_status:"confirmed",
        })
        .where(eq(usersTable.email, userData.email));

      console.log(updateUser);
      res.status(201).json({ message: "User signup successful" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

export default userSignup;
