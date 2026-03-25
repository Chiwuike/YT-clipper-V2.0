import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";
import { canAddChannel } from "@/app/api/utils/access-control";

export async function GET(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const channels = await sql`
      SELECT * FROM channels 
      WHERE user_id = ${session.user.id} 
      ORDER BY created_at DESC
    `;
    return Response.json(channels);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch channels" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if user can add more channels based on their plan
    const accessCheck = await canAddChannel(session.user.id);
    if (!accessCheck.allowed) {
      return Response.json(
        {
          error: "Channel limit reached",
          message: `Your ${accessCheck.limit === 1 ? "free plan allows only 1 channel" : "plan allows up to " + accessCheck.limit + " channels"}. Upgrade to add more.`,
          current: accessCheck.current,
          limit: accessCheck.limit,
        },
        { status: 403 },
      );
    }

    const { youtubeUrl, minLen, maxLen } = await req.json();

    // Extract channel handle or name for initial storage
    // In a real app, we'd fetch the name via YouTube API
    const handle = youtubeUrl.split("@")[1] || "YouTube Channel";

    const [newChannel] = await sql`
      INSERT INTO channels (user_id, youtube_url, channel_name, clip_length_min, clip_length_max)
      VALUES (${session.user.id}, ${youtubeUrl}, ${handle}, ${minLen}, ${maxLen})
      RETURNING *
    `;
    return Response.json(newChannel);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to add channel" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    await sql`
      DELETE FROM channels 
      WHERE id = ${id} AND user_id = ${session.user.id}
    `;
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete channel" },
      { status: 500 },
    );
  }
}
