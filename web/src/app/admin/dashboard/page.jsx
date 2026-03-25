/**
 * Admin Dashboard
 *
 * Centralized control panel for system administrators.
 * Features:
 * - User management and plan control
 * - System statistics and health monitoring
 * - Video processing queue overview
 * - Database access controls
 */

"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Video,
  Activity,
  Shield,
  TrendingUp,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  Crown,
  Zap,
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function AdminDashboardPage() {
  const { data: user, loading } = useUser();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      window.location.href = "/dashboard";
    }
  }, [user, loading]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoadingData(true);

      // Fetch admin stats
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch recent users
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch recent videos
      const videosRes = await fetch("/api/admin/videos");
      const videosData = await videosRes.json();
      setVideos(videosData);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return null;
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "blue",
      trend: `+${stats?.newUsersToday || 0} today`,
    },
    {
      title: "Active Subscriptions",
      value: stats?.activeSubscriptions || 0,
      icon: Zap,
      color: "orange",
      trend: `$${stats?.monthlyRevenue || 0}/mo`,
    },
    {
      title: "Videos Processed",
      value: stats?.totalVideos || 0,
      icon: Video,
      color: "green",
      trend: `${stats?.videosToday || 0} today`,
    },
    {
      title: "System Health",
      value: stats?.systemHealth || "100%",
      icon: Activity,
      color: "purple",
      trend: "All systems operational",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50 dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Admin Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Crown className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-jetbrains-mono">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                System Overview & User Management
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-bold text-sm">
            <Shield size={16} className="inline mr-2" />
            Administrator
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : stat.color === "orange"
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : stat.color === "green"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-purple-100 dark:bg-purple-900/30"
                  }`}
                >
                  <stat.icon
                    className={
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "orange"
                          ? "text-orange-600"
                          : stat.color === "green"
                            ? "text-green-600"
                            : "text-purple-600"
                    }
                    size={20}
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                  {stat.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white font-jetbrains-mono">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono mt-1">
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-jetbrains-mono">
                Recent Users
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {loadingData ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                </div>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm font-jetbrains-mono">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                          {user.name || "No name"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.plan === "free"
                            ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            : user.plan === "semi_annual"
                              ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                              : user.plan === "annual"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                                : "bg-pink-100 dark:bg-pink-900/30 text-pink-600"
                        }`}
                      >
                        {user.plan?.toUpperCase()}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 font-jetbrains-mono">
                        {user.video_minutes_used || 0} min used
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8 font-jetbrains-mono">
                  No users yet
                </p>
              )}
            </div>
          </div>

          {/* Processing Queue */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-jetbrains-mono">
                Processing Queue
              </h2>
            </div>
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {loadingData ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                </div>
              ) : videos.length > 0 ? (
                videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-all"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate font-jetbrains-mono">
                          {video.title || "Untitled Video"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                          {video.youtube_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {video.status === "completed" ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : video.status === "failed" ? (
                        <XCircle size={18} className="text-red-500" />
                      ) : video.status === "processing" ? (
                        <Clock size={18} className="text-orange-500" />
                      ) : (
                        <Clock size={18} className="text-gray-400" />
                      )}
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase font-jetbrains-mono">
                        {video.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8 font-jetbrains-mono">
                  No videos in queue
                </p>
              )}
            </div>
          </div>
        </div>

        {/* System Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-jetbrains-mono mb-6">
            System Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-6 py-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all font-jetbrains-mono flex items-center justify-center space-x-2">
              <Database size={18} />
              <span>Database Backup</span>
            </button>
            <button className="px-6 py-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl font-bold hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all font-jetbrains-mono flex items-center justify-center space-x-2">
              <Activity size={18} />
              <span>Run Monitor</span>
            </button>
            <button className="px-6 py-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all font-jetbrains-mono flex items-center justify-center space-x-2">
              <TrendingUp size={18} />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .inline-block.h-8.w-8.border-4 {
          animation: spin 1s linear infinite;
        }
        .inline-block.h-12.w-12.border-4 {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
