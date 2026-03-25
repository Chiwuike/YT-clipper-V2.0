/**
 * Admin Videos API
 *
 * Returns list of videos in the processing queue.
 * Requires admin privileges.
 *
 * GET /api/admin/videos
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

    // Get recent videos with their processing status
    const videos = await sql`
      SELECT 
        v.id,
        v.youtube_id,
        v.title,
        v.status,
        v.created_at,
        v.processed_at,
        c.channel_name
      FROM videos v
      LEFT JOIN channels c ON v.channel_id = c.id
      ORDER BY v.created_at DESC
      LIMIT 50
    `;

    return Response.json(videos);
  } catch (error) {
    console.error("Error fetching admin videos:", error);
    return Response.json(
      {
        error: "Failed to fetch videos",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
