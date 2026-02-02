import { eq } from "drizzle-orm";
import { db } from "../../database/db";
import type { NextFunction, Request, Response } from "express";
import { usersTable } from "../../schema/schema";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Request to include `user`
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// Type guard to check decoded JWT
function isAuthPayload(obj: any): obj is { id: string; email: string } {
  return obj && typeof obj === "object" && "id" in obj && "email" in obj;
}

const onboardingAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = authHeader.split(" ")[1];

    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Use type guard instead of `any`
    if (!isAuthPayload(decoded)) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: decoded.id, email: decoded.email };

    console.log(req.user.id);

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, req.user.email))
      .limit(1);

    if (!existingUser.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser[0].user_onboarding_completed === "true") {
      return res.status(409).json({ message: "Onboarding already completed" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default onboardingAccess;
