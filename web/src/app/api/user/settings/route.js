/**
 * User Settings API
 *
 * GET - Fetch user settings
 * POST - Update user settings (storage provider, custom drive email)
 */

import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await sql`
      SELECT 
        storage_provider,
        custom_drive_email
      FROM auth_users
      WHERE id = ${session.user.id}
    `;

    return Response.json({
      storage_provider: user?.storage_provider || "cloudinary",
      custom_drive_email: user?.custom_drive_email || "",
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json(
      {
        error: "Failed to fetch settings",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { storage_provider, custom_drive_email } = body;

    // Validate storage provider
    if (
      storage_provider &&
      !["cloudinary", "google_drive"].includes(storage_provider)
    ) {
      return Response.json(
        {
          error:
            "Invalid storage provider. Must be 'cloudinary' or 'google_drive'",
        },
        { status: 400 },
      );
    }

    // Update settings
    await sql`
      UPDATE auth_users
      SET 
        storage_provider = ${storage_provider || "cloudinary"},
        custom_drive_email = ${custom_drive_email || null}
      WHERE id = ${session.user.id}
    `;

    return Response.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return Response.json(
      {
        error: "Failed to update settings",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
