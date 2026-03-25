/**
 * Cloudinary Storage API
 *
 * Server-side endpoint for uploading videos to Cloudinary
 * Used by the video processing worker
 *
 * POST /api/storage/cloudinary - Upload video file
 */

import { uploadVideoToCloudinary } from "@/utils/cloudinary";
import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filePath, fileName, clipId, videoId } = body;

    if (!filePath) {
      return Response.json({ error: "File path required" }, { status: 400 });
    }

    console.log(`📤 Uploading to Cloudinary: ${fileName}`);

    // Upload to Cloudinary
    const result = await uploadVideoToCloudinary(filePath, {
      filename: fileName,
      folder: "viral-clipper",
      tags: ["clip", `user_${session.user.id}`, `video_${videoId}`],
    });

    console.log(`✅ Cloudinary upload complete: ${result.url}`);

    // Update clip with Cloudinary URL
    if (clipId) {
      await sql`
        UPDATE clips 
        SET 
          video_url = ${result.url},
          storage_provider = 'cloudinary',
          cloudinary_public_id = ${result.publicId}
        WHERE id = ${clipId}
      `;
    }

    // Mark file for deletion after 72 hours
    await sql`
      INSERT INTO temp_files (file_path, created_at, delete_after)
      VALUES (${filePath}, NOW(), NOW() + INTERVAL '72 hours')
      ON CONFLICT DO NOTHING
    `;

    return Response.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      duration: result.duration,
      message: "Video uploaded to Cloudinary successfully",
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return Response.json(
      {
        error: "Upload failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
