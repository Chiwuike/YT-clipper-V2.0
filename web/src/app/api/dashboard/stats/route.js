import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    const [channels] =
      await sql`SELECT COUNT(*) as count FROM channels WHERE user_id = ${userId}`;

    const [clips] = await sql`
      SELECT COUNT(*) as count 
      FROM clips c
      JOIN videos v ON c.video_id = v.id
      JOIN channels ch ON v.channel_id = ch.id
      WHERE ch.user_id = ${userId}
    `;

    const [avgScore] = await sql`
      SELECT AVG(score) as avg 
      FROM clips c
      JOIN videos v ON c.video_id = v.id
      JOIN channels ch ON v.channel_id = ch.id
      WHERE ch.user_id = ${userId}
    `;

    const recentClips = await sql`
      SELECT c.id, v.title, c.score, c.created_at as date
      FROM clips c
      JOIN videos v ON c.video_id = v.id
      JOIN channels ch ON v.channel_id = ch.id
      WHERE ch.user_id = ${userId}
      ORDER BY c.created_at DESC
      LIMIT 5
    `;

    return Response.json({
      channelsCount: parseInt(channels.count),
      clipsCount: parseInt(clips.count),
      avgScore: parseFloat(avgScore.avg || 0).toFixed(1),
      avgProcessTime: "12m",
      recentClips: recentClips.map((clip) => ({
        ...clip,
        date: new Date(clip.date).toLocaleDateString(),
      })),
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
