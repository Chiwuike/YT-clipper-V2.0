/**
 * Admin Stats API
 *
 * Returns system-wide statistics for the admin dashboard.
 * Requires admin privileges.
 *
 * GET /api/admin/stats
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

    // Total users
    const [userCount] = await sql`
      SELECT COUNT(*) as count FROM auth_users
    `;

    // New users today
    const [newUsersToday] = await sql`
      SELECT COUNT(*) as count 
      FROM auth_users 
      WHERE created_at >= CURRENT_DATE
    `;

    // Active subscriptions (non-free plans)
    const [activeSubsCount] = await sql`
      SELECT COUNT(*) as count 
      FROM auth_users 
      WHERE plan != 'free' 
      AND (plan_expires_at IS NULL OR plan_expires_at > NOW())
    `;

    // Monthly revenue estimate
    const [revenueData] = await sql`
      SELECT 
        SUM(CASE WHEN plan = 'semi_annual' THEN 25.99 / 6 ELSE 0 END) +
        SUM(CASE WHEN plan = 'annual' THEN 49.99 / 12 ELSE 0 END) as monthly_revenue
      FROM auth_users
      WHERE plan != 'free' 
      AND (plan_expires_at IS NULL OR plan_expires_at > NOW())
    `;

    // Total videos
    const [videoCount] = await sql`
      SELECT COUNT(*) as count FROM videos
    `;

    // Videos processed today
    const [videosToday] = await sql`
      SELECT COUNT(*) as count 
      FROM videos 
      WHERE processed_at >= CURRENT_DATE
    `;

    // Total clips generated
    const [clipsCount] = await sql`
      SELECT COUNT(*) as count FROM clips
    `;

    // System health (check if any processing failures)
    const [failedVideos] = await sql`
      SELECT COUNT(*) as count 
      FROM videos 
      WHERE status = 'failed' 
      AND created_at >= NOW() - INTERVAL '24 hours'
    `;

    const systemHealth = failedVideos.count > 10 ? "⚠️ Issues Detected" : "100%";

    return Response.json({
      totalUsers: parseInt(userCount.count),
      newUsersToday: parseInt(newUsersToday.count),
      activeSubscriptions: parseInt(activeSubsCount.count),
      monthlyRevenue: parseFloat(revenueData.monthly_revenue || 0).toFixed(2),
      totalVideos: parseInt(videoCount.count),
      videosToday: parseInt(videosToday.count),
      totalClips: parseInt(clipsCount.count),
      systemHealth,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return Response.json(
      {
        error: "Failed to fetch stats",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
