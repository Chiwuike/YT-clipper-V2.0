import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("search") || "";

  try {
    let query = `
      SELECT c.*, v.title, v.thumbnail_url 
      FROM clips c
      JOIN videos v ON c.video_id = v.id
      JOIN channels ch ON v.channel_id = ch.id
      WHERE ch.user_id = $1
    `;
    const params = [session.user.id];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND v.title ILIKE $${params.length}`;
    }

    if (filter === "high-score") {
      query += ` AND c.score >= 8.0`;
    }

    query += ` ORDER BY c.created_at DESC`;

    const clips = await sql(query, params);
    return Response.json(clips);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch clips" }, { status: 500 });
  }
}
