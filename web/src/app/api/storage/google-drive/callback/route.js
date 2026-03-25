/**
 * Google Drive OAuth Callback
 *
 * Handles the OAuth callback from Google and stores tokens
 *
 * GET /api/storage/google-drive/callback?code=...
 */

import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI =
  process.env.GOOGLE_REDIRECT_URI ||
  `${process.env.AUTH_URL}/api/storage/google-drive/callback`;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return new Response(
        `
        <html>
          <body>
            <h1>Authorization Failed</h1>
            <p>${error}</p>
            <a href="/dashboard">Return to Dashboard</a>
          </body>
        </html>
      `,
        {
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    if (!code) {
      return Response.json(
        { error: "No authorization code provided" },
        { status: 400 },
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens");
    }

    const tokens = await tokenResponse.json();

    // Get user info
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const userInfo = await userInfoResponse.json();

    // Store tokens in database
    const existing = await sql`
      SELECT id FROM user_storage WHERE user_id = ${session.user.id}
    `;

    if (existing.length > 0) {
      await sql`
        UPDATE user_storage
        SET 
          google_drive_token = ${tokens.access_token},
          google_drive_refresh_token = ${tokens.refresh_token},
          google_drive_email = ${userInfo.email},
          google_drive_connected = true,
          last_sync_at = NOW()
        WHERE user_id = ${session.user.id}
      `;
    } else {
      await sql`
        INSERT INTO user_storage (
          user_id,
          google_drive_token,
          google_drive_refresh_token,
          google_drive_email,
          google_drive_connected
        )
        VALUES (
          ${session.user.id},
          ${tokens.access_token},
          ${tokens.refresh_token},
          ${userInfo.email},
          true
        )
      `;
    }

    // Return success page with auto-redirect
    return new Response(
      `
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=/dashboard" />
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { margin: 0 0 10px 0; font-size: 32px; }
            p { margin: 0; opacity: 0.9; }
            .checkmark {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              background: #22c55e;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="checkmark">✓</div>
            <h1>Google Drive Connected!</h1>
            <p>Your clips will now be stored in your Google Drive.</p>
            <p style="margin-top: 20px; font-size: 14px;">Redirecting to dashboard...</p>
          </div>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response(
      `
      <html>
        <body>
          <h1>Connection Failed</h1>
          <p>${error.message}</p>
          <a href="/dashboard">Return to Dashboard</a>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  }
}
