import type { Request, Response } from "express";
import { db } from "../../database/db.js";
<<<<<<< HEAD
import { createOrganization, usersTable } from "../../schema/schema.js";
=======
import { usersTable } from "../../schema/schema.js";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
import { eq } from "drizzle-orm";

interface JwtPayload {
  id?: number;
  email?: string;
  userRole?: string;
}

/**
 * Fetch users for the requester.
 * - System admin: gets all users.
 * - Buyer (Admin) / Vendor (Admin): only users from their own organization.
 */
const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const decoded = (req as { user?: JwtPayload }).user;
    const userId = decoded?.id;

    if (userId == null) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const currentUserRows = await db
      .select({
<<<<<<< HEAD
        organization_id: usersTable.organization_id,
=======
        organization_name: usersTable.organization_name,
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
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

<<<<<<< HEAD
    let userRows: { user: typeof usersTable.$inferSelect; organizationName: string | null }[];
    if (platformRole === "vendor" || platformRole === "buyer") {
      const orgId = currentUser.organization_id;
      if (orgId == null) {
        userRows = [];
      } else {
        userRows = await db
          .select({
            user: usersTable,
            organizationName: createOrganization.organizationName,
          })
          .from(usersTable)
          .leftJoin(createOrganization, eq(usersTable.organization_id, createOrganization.id))
          .where(eq(usersTable.organization_id, orgId));
      }
    } else {
      userRows = await db
        .select({
          user: usersTable,
          organizationName: createOrganization.organizationName,
        })
        .from(usersTable)
        .leftJoin(createOrganization, eq(usersTable.organization_id, createOrganization.id));
    }

    const data = userRows.map(({ user, organizationName }) => ({
      ...user,
      organization_id: user.organization_id,
      organization_name: organizationName ?? "",
    }));

    res.status(200).json({
      message: "Users fetched successfully",
      data,
=======
    let users: unknown[];
    if (platformRole === "vendor" || platformRole === "buyer") {
      const orgName = currentUser.organization_name;
      if (!orgName) {
        users = [];
      } else {
        users = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.organization_name, orgName));
      }
    } else {
      users = await db.select().from(usersTable);
    }

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
    });
  } catch (error) {
    console.error(
      "Error in fetchAllUsers:",
      error instanceof Error ? error.message : String(error)
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export default fetchAllUsers;
