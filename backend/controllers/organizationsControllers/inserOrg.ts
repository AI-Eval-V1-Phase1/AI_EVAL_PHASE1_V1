import { db } from "../../database/db";
import { createOrg } from "../../schema";

const inserOrganization = async (req, res) => {
//   console.log(req.body);
  const organizationName = req.body.isOrganizationName
//   console.log(organizationName)
  try {
    await db.insert(createOrg).values({organizationName});
    res.status(200).json({ message: "Organization received" });
  } catch (error) {
    console.log("Error in organizationController:", error.message);
  }
};

export default inserOrganization;
