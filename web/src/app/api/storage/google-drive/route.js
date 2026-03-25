/**
 * Google Drive Integration API
 *
 * Handles OAuth connection and file uploads to user's Google Drive
 * Solves the 10GB server storage limitation by storing clips in user's Drive
 *
 * POST /api/storage/google-drive - Upload clip to Drive
 * GET /api/storage/google-drive - Check connection status
 */

import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// Note: You'll need to add these to your environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  `${process.env.AUTH_URL}/api/storage/google-drive/callback`;

/**
 * Upload a file to user's Google Drive
 */
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filePath, fileName, clipId } = body;

    // Get user's Google Drive token
    const [userStorage] = await sql`
      SELECT google_drive_token, google_drive_refresh_token
      FROM user_storage
      WHERE user_id = ${session.user.id}
      LIMIT 1
    `;

    if (!userStorage || !userStorage.google_drive_token) {
      return Response.json(
        {
          error: "Google Drive not connected",
          needsAuth: true,
          authUrl: getGoogleAuthUrl(),
        },
        { status: 403 },
      );
    }

    // Upload file to Google Drive
    const driveUrl = await uploadToGoogleDrive(
      filePath,
      fileName,
      userStorage.google_drive_token,
    );

    // Update clip with Drive URL
    if (clipId) {
      await sql`
        UPDATE clips 
        SET drive_url = ${driveUrl}, video_url = ${driveUrl}
        WHERE id = ${clipId}
      `;
    }

    // Mark file for deletion (handled by cleanup worker)
    await sql`
      INSERT INTO temp_files (file_path, created_at, delete_after)
      VALUES (${filePath}, NOW(), NOW() + INTERVAL '72 hours')
    `;

    return Response.json({
      success: true,
      driveUrl,
      message: "Clip uploaded to Google Drive",
    });
  } catch (error) {
    console.error("Google Drive upload error:", error);
    return Response.json(
      {
        error: "Upload failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * Check Google Drive connection status
 */
export async function GET(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userStorage] = await sql`
      SELECT 
        google_drive_connected,
        google_drive_email,
        storage_quota_used,
        last_sync_at
      FROM user_storage
      WHERE user_id = ${session.user.id}
      LIMIT 1
    `;

    if (!userStorage) {
      return Response.json({
        connected: false,
        authUrl: getGoogleAuthUrl(),
      });
    }

    return Response.json({
      connected: userStorage.google_drive_connected || false,
      email: userStorage.google_drive_email,
      quotaUsed: userStorage.storage_quota_used || 0,
      lastSync: userStorage.last_sync_at,
      authUrl: !userStorage.google_drive_connected ? getGoogleAuthUrl() : null,
    });
  } catch (error) {
    console.error("Storage check error:", error);
    return Response.json(
      {
        error: "Failed to check storage",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * Generate Google OAuth URL
 */
function getGoogleAuthUrl() {
  const scopes = [
    "https://www.googleapis.com/auth/drive.file", // Create and manage files
    "https://www.googleapis.com/auth/userinfo.email", // Get user email
  ];

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Upload file to Google Drive using Google Drive API
 */
async function uploadToGoogleDrive(filePath, fileName, accessToken) {
  const fs = require("fs/promises");

  // Read file
  const fileBuffer = await fs.readFile(filePath);

  // Create metadata
  const metadata = {
    name: fileName,
    mimeType: "video/mp4",
    parents: ["root"], // Upload to root, you can create a specific folder
  };

  // Upload to Google Drive using multipart upload
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: video/mp4\r\n" +
    "Content-Transfer-Encoding: base64\r\n" +
    "\r\n" +
    fileBuffer.toString("base64") +
    closeDelimiter;

  const response = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    },
  );

  if (!response.ok) {
    throw new Error(`Google Drive upload failed: ${response.statusText}`);
  }

  const result = await response.json();

  // Return shareable link
  return `https://drive.google.com/file/d/${result.id}/view`;
}
