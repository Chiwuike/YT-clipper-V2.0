/**
 * User Plan Info API
 *
 * Returns the authenticated user's subscription plan, usage, and limits.
 *
 * GET /api/user/plan
 */

import { auth } from "@/auth";
import { getUserPlanInfo } from "@/app/api/utils/access-control";

export async function GET(req) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planInfo = await getUserPlanInfo(session.user.id);

    return Response.json(planInfo);
  } catch (error) {
    console.error("Error fetching plan info:", error);
    return Response.json(
      {
        error: "Failed to fetch plan information",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
