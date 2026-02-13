import type { Request, Response } from "express";
import { db } from "../../database/db.js";
<<<<<<< HEAD
import { createOrganization, usersTable } from "../../schema/schema.js";
=======
import { usersTable } from "../../schema/schema.js";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const userLogin = async (req: Request, res: Response) => {
  const rawEmail = req.body?.email;
  const userPassword = req.body?.password;
  const email = (rawEmail ?? "").toString().trim().toLowerCase();
  if (!email) {
    return res.status(401).json({ message: "Email is required" });
  }
  if (userPassword == null || userPassword === "") {
    return res.status(401).json({ message: "Password is required" });
  }

  try {
<<<<<<< HEAD
    const rows = await db
      .select({
        user: usersTable,
        organizationName: createOrganization.organizationName,
      })
      .from(usersTable)
      .leftJoin(createOrganization, eq(usersTable.organization_id, createOrganization.id))
      .where(eq(usersTable.email, email))
      .limit(1);
    const row = rows[0];
    if (!row) {
      return res.status(401).json({ message: "User not found" });
    }
    const user_table = row.user;

    if (!user_table.user_password || user_table.user_password.trim() === "") {
      return res.status(401).json({ message: "User not found" });
    }

        const user = await db
=======
    const user = await db
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
<<<<<<< HEAD
    const usertable = user[0];
    if (!usertable) {
      return res.status(401).json({ message: "User not found" });
    }

    const userStatus = String(usertable.userStatus ?? "active").trim().toLowerCase();
    if (userStatus === "inactive") {
      return res.status(403).json({
        message: "Your account is inactive. Contact your administrator to restore access.",
        code: "inactive",
      });
    }

    if (!usertable.user_password || usertable.user_password.trim() === "") {
      return res.status(401).json({ message: "User has been invited.", code: "invited" });
=======
    const user_table = user[0];
    if (!user_table) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user_table.user_password || user_table.user_password.trim() === "") {
      return res.status(401).json({ message: "User not found" });
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    }

    const passwordMatch = await bcrypt.compare(
      userPassword,
      user_table.user_password,
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Password is mismatched" });
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

<<<<<<< HEAD
    const userDetails = [{ ...user_table, organization_name: row.organizationName ?? "", organization_id: user_table.organization_id }];
    return res.status(200).json({
      message: "User Login Successful",
      token,
      userDetails,
=======
    return res.status(200).json({
      message: "User Login Successful",
      token,
      userDetails: user,
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "An error occurred during login. Please try again.",
    });
  }
};

export default userLogin;
