import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Extend Request to include 'user'
interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your-secret-key";

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalid or expired" });

    req.user = decoded; // now TypeScript knows about 'user'

    next();
  });
};

export default authenticateToken;
