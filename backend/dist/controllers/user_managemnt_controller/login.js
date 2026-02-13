import { db } from "../../database/db.js";
import { usersTable } from "../../schema/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userLogin = async (req, res) => {
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
        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);
        const user_table = user[0];
        if (!user_table) {
            return res.status(401).json({ message: "User not found" });
        }
        if (!user_table.user_password || user_table.user_password.trim() === "") {
            return res.status(401).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(userPassword, user_table.user_password);
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
        if (!secret)
            throw new Error("JWT_SECRET_KEY not set");
        const token = jwt.sign({
            id: user_table.id,
            email: user_table.email,
            userRole: user_table.role,
        }, secret, { expiresIn: "24h" });
        return res.status(200).json({
            message: "User Login Successful",
            token,
            userDetails: user,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "An error occurred during login. Please try again.",
        });
    }
};
export default userLogin;
