import { db } from "../../database/db";
import { createOrg } from "../../schema";

const fetchOrganizations = async (req, res) => {
  try {
    const organizations = await db
      .select()
      .from(createOrg);

    res.status(200).json({
      message: "Organizations fetched successfully",
      data: organizations,
    });
  } catch (error) {
    console.error("Error in fetchOrganizations:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default fetchOrganizations;
