import type { Request, Response } from "express";
import { db } from "../../database/db";
import { usersTable } from "../../schema/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const userLogin = async (req: Request, res: Response) => {
  const useremail = req.body.email;
  const userPassword = req.body.password;
  // console.log(req.body);

  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, useremail))
      .limit(1);
    let hashedPassword;
    // console.log(usersTable.user_password)
    const user_table = user[0];

    if (user) {
      hashedPassword = await bcrypt.compare(
        userPassword,
        user_table.user_password,
      );
    }

    // console.log("DB",typeof(user_table.user_password))
    // console.log("user",typeof(userPassword))
    // console.log(hashedPassword)
    if (!hashedPassword) {
      console.log("here");
      return res.status(500).json({ message: "Password Incorrect" });
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

    if (user.length == 0) {
      res.status(409).json({ message: "Invalid User" });
      return;
    }



    const token = jwt.sign(
      {
        id: user_table.id,
        email: user_table.email,
        userRole:user_table.role
      },
      process.env.JWT_SECRET_KEY,
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
