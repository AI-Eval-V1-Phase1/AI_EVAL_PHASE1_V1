import type {Request, Response } from "express";
import { usersData } from "../../schema/schema.js";

//** Fetch all users Details and send it to frontend(client) side

const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await usersData

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error in fetchAllUsers:", error instanceof Error ? error.message : String(error));
    res.status(500).json({ error: "Internal server error" });
  }
};

export default fetchAllUsers;
