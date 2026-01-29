
//** Select the complete organization table

import { db } from "../../database/db";
import { createOrganization } from "./createOrganization";

export const organizationsData = db
      .select()
      .from(createOrganization);