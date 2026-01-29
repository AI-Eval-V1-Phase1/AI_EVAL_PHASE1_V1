import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userTokenVerify = async (req: Request, res: Response, next:NextFunction) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded.email) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid token format!" });
    }
    next()
  } catch (error) {
    console.log(error);
  }
};


export default userTokenVerify