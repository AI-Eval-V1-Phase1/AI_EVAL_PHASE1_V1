import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

// Extend Request to include email
interface InviteTokenRequest extends Request {
  email?: string;
}

// Your token payload
interface InviteTokenPayload extends JwtPayload {
  email: string;
}

const userTokenVerify = (req: InviteTokenRequest, res: Response, next: NextFunction) => {
  // Normalize token to string
  const tokenParam = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;

  if (!tokenParam) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(tokenParam, process.env.JWT_SECRET_KEY!) as JwtPayload | string;

    // Make sure decoded is an object and has email
    if (typeof decoded !== "object" || !("email" in decoded)) {
      return res.status(400).json({ message: "Invalid token format!" });
    }

    req.email = (decoded as InviteTokenPayload).email;

    console.log("Verified email from token:", req.email);

    next();
  } catch (err: any) {
    console.log("JWT verify error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userTokenVerify;
