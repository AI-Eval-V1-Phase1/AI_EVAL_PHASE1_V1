
//** Select the complete users table

import { db } from "../../database/db";
import { usersTable } from "./invite_user_schema";

export const usersData = db
      .select()
      .from(usersTable);