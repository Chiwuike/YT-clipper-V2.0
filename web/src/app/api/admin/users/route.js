/**
 * Admin Users API
 *
 * Returns list of users with their plan and usage information.
 * Requires admin privileges.
 *
 * GET /api/admin/users
 */

import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { isAdmin } from "@/app/api/utils/access-control";

export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminCheck = await isAdmin(session.user.id);

    if (!adminCheck) {
      return Response.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 },
      );
    }

    // Get recent users with their stats
    const users = await sql`
      SELECT 
        id,
        email,
        name,
        role,
        plan,
        plan_expires_at,
        video_minutes_used,
        created_at
      FROM auth_users
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return Response.json(users);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return Response.json(
      {
        error: "Failed to fetch users",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
