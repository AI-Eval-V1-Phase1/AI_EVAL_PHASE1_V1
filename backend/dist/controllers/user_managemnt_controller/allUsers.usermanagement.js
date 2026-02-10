import { db } from "../../database/db.js";
import { usersTable } from "../../schema/schema.js";
import { eq } from "drizzle-orm";
/**
 * Fetch users for the requester.
 * - System admin: gets all users.
 * - Buyer (Admin) / Vendor (Admin): only users from their own organization.
 */
const fetchAllUsers = async (req, res) => {
    try {
        const decoded = req.user;
        const userId = decoded?.id;
        if (userId == null) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const currentUserRows = await db
            .select({
            organization_name: usersTable.organization_name,
            user_platform_role: usersTable.user_platform_role,
        })
            .from(usersTable)
            .where(eq(usersTable.id, Number(userId)))
            .limit(1);
        const currentUser = currentUserRows[0];
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const platformRole = (currentUser.user_platform_role ?? "").trim().toLowerCase();
        let users;
        if (platformRole === "vendor" || platformRole === "buyer") {
            const orgName = currentUser.organization_name;
            if (!orgName) {
                users = [];
            }
            else {
                users = await db
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.organization_name, orgName));
            }
        }
        else {
            users = await db.select().from(usersTable);
        }
        res.status(200).json({
            message: "Users fetched successfully",
            data: users,
        });
    }
    catch (error) {
        console.error("Error in fetchAllUsers:", error instanceof Error ? error.message : String(error));
        res.status(500).json({ error: "Internal server error" });
    }
};
export default fetchAllUsers;
