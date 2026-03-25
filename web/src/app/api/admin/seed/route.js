/**
 * Admin Seeding Route
 *
 * This route creates the initial admin account with hardcoded credentials.
 * Security: Only runs once - checks if admin already exists before creating.
 *
 * POST /api/admin/seed
 */

import sql from "@/app/api/utils/sql";
import { hash } from "argon2";

export async function POST(req) {
  try {
    const ADMIN_EMAIL = "michaelazubuike.MA@gmail.com";
    const ADMIN_PASSWORD = "ShadowBackDoor@72";

    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id FROM auth_users WHERE email = ${ADMIN_EMAIL} LIMIT 1
    `;

    if (existingAdmin.length > 0) {
      return Response.json(
        {
          message: "Admin account already exists",
          admin_email: ADMIN_EMAIL,
        },
        { status: 200 },
      );
    }

    // Hash the password securely using argon2
    const hashedPassword = await hash(ADMIN_PASSWORD);

    // Create admin user
    const [adminUser] = await sql`
      INSERT INTO auth_users (
        email, 
        name, 
        role, 
        plan,
        "emailVerified"
      )
      VALUES (
        ${ADMIN_EMAIL},
        'System Administrator',
        'admin',
        'unlimited',
        NOW()
      )
      RETURNING id
    `;

    // Create credentials account
    await sql`
      INSERT INTO auth_accounts (
        "userId",
        type,
        provider,
        "providerAccountId",
        password
      )
      VALUES (
        ${adminUser.id},
        'credentials',
        'credentials',
        ${ADMIN_EMAIL},
        ${hashedPassword}
      )
    `;

    console.log("✅ Admin account created successfully");

    return Response.json(
      {
        success: true,
        message: "Admin account created successfully",
        admin_email: ADMIN_EMAIL,
        user_id: adminUser.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    return Response.json(
      {
        error: "Failed to create admin account",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
