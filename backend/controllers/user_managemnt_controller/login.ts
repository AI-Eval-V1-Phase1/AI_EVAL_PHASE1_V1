import type { Request, Response } from "express";
import { db } from "../../database/db.js";
import { usersTable } from "../../schema/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const userLogin = async (req: Request, res: Response) => {
  const rawEmail = req.body.email;
  const userPassword = req.body.password;
  const emailTrimmed = (rawEmail ?? "").toString().trim();
  if (!emailTrimmed) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, emailTrimmed))
      .limit(1);
    const user_table = user[0];
    if (!user_table) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user_table.user_password || user_table.user_password.trim() === "") {
      return res.status(401).json({
        message: "Please complete your signup first. Check your email for the signup link.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      userPassword,
      user_table.user_password,
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password Incorrect" });
    }
    // const checkUser = await db
    //   .select()
    //   .from(usersTable)
    //   .where(
    //     and(
    //       eq(usersTable.email, useremail),
    //       eq(usersTable.user_password, userPassword),
    //     ),
    //   )
    //   .limit(1);

    // console.log("checkUser", user);

    const secret = process.env.JWT_SECRET_KEY ?? "";
    if (!secret) throw new Error("JWT_SECRET_KEY not set");
    const token = jwt.sign(
      {
        id: user_table.id,
        email: user_table.email,
        userRole: user_table.role,
      },
      secret,
      { expiresIn: "24h" },
    );

    return res.status(200).json({
      message: "User Login Successful",
      token,
      userDetails: user,
    });
  } catch (error) {
    console.log(error);
  }
};

export default userLogin;
