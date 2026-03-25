import sql from "@/app/api/utils/sql";

export async function GET(req) {
  const authHeader = req.headers.get("x-worker-secret");
  if (authHeader !== process.env.WORKER_SECRET) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const channels = await sql`SELECT * FROM channels`;

    for (const channel of channels) {
      // Fetch RSS feed
      // Extract new video IDs
      // Check if video already exists in 'videos' table
      // If new, INSERT INTO videos (status: 'pending')
      // Note: User requested 24h delay, so we can store upload_date and only set status to 'pending' after 24h
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
