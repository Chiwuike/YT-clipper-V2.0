/**
 * Access Control & Authorization Utilities
 *
 * All users have unlimited access - no restrictions
 */

import sql from "./sql";

/**
 * Plan Limits Configuration (kept for reference, not enforced)
 */
export const PLAN_LIMITS = {
  free: {
    videoMinutes: Infinity,
    channels: Infinity,
    price: 0,
  },
  unlimited: {
    videoMinutes: Infinity,
    channels: Infinity,
    price: 0,
  },
};

/**
 * Check if user has admin privileges
 */
export async function isAdmin(userId) {
  if (!userId) return false;

  const [user] = await sql`
    SELECT role FROM auth_users WHERE id = ${userId} LIMIT 1
  `;

  return user?.role === "admin";
}

/**
 * Get user's current plan and usage
 * Returns unlimited for all users
 */
export async function getUserPlanInfo(userId) {
  const [user] = await sql`
    SELECT 
      role,
      plan,
      plan_expires_at,
      video_minutes_used,
      email
    FROM auth_users 
    WHERE id = ${userId} 
    LIMIT 1
  `;

  if (!user) {
    throw new Error("User not found");
  }

  const isAdminUser = user.role === "admin";

  return {
    userId,
    email: user.email,
    role: user.role,
    plan: "unlimited",
    isAdmin: isAdminUser,
    videoMinutesUsed: user.video_minutes_used || 0,
    videoMinutesLimit: Infinity,
    channelsLimit: Infinity,
    planExpiresAt: null,
    isExpired: false,
  };
}

/**
 * Check if user can process a video
 * Always returns true - no restrictions
 */
export async function canProcessVideo(userId, videoMinutes) {
  return { allowed: true, reason: "unlimited_access" };
}

/**
 * Track video processing usage
 * Tracks for statistics only, no enforcement
 */
export async function trackVideoUsage(userId, videoMinutes) {
  await sql`
    UPDATE auth_users 
    SET video_minutes_used = video_minutes_used + ${videoMinutes}
    WHERE id = ${userId}
  `;

  return {
    tracked: true,
  };
}

/**
 * Check if user can add more channels
 * Always returns true - no restrictions
 */
export async function canAddChannel(userId) {
  return { allowed: true, reason: "unlimited_access" };
}

/**
 * Upgrade user's plan (deprecated - all users unlimited)
 */
export async function upgradePlan(userId, newPlan) {
  // No-op, all users have unlimited access
  return {
    plan: "unlimited",
    expiresAt: null,
  };
}
