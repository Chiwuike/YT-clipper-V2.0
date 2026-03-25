/**
 * Admin Initialization Page
 *
 * One-time setup page to create the admin account.
 * Visit this page once after deployment to seed the admin user.
 */

"use client";

import { useState } from "react";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminInitPage() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const initializeAdmin = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to create admin account");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <Shield
              className="text-purple-600 dark:text-purple-400"
              size={32}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-jetbrains-mono">
            Admin Setup
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-jetbrains-mono text-sm">
            Initialize the system administrator account
          </p>
        </div>

        {status === "idle" && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-jetbrains-mono">
                ⚠️ This will create the admin account with pre-configured
                credentials. Only run this once during initial setup.
              </p>
            </div>
            <button
              onClick={initializeAdmin}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30 font-jetbrains-mono"
            >
              Initialize Admin Account
            </button>
          </div>
        )}

        {status === "loading" && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
              Creating admin account...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <CheckCircle
                  className="text-green-600 dark:text-green-400"
                  size={32}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-jetbrains-mono">
                Success!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-jetbrains-mono">
                {message}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                Admin Email:{" "}
                <span className="font-bold">michaelazubuike.MA@gmail.com</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                Password: <span className="font-bold">ShadowBackDoor@72</span>
              </p>
            </div>
            <a
              href="/account/signin"
              className="block w-full py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-all font-jetbrains-mono"
            >
              Go to Sign In
            </a>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle
                  className="text-red-600 dark:text-red-400"
                  size={32}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-jetbrains-mono">
                Error
              </h2>
              <p className="text-red-600 dark:text-red-400 text-sm font-jetbrains-mono">
                {message}
              </p>
            </div>
            <button
              onClick={() => setStatus("idle")}
              className="w-full py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-jetbrains-mono"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 font-jetbrains-mono">
            For security, this page should be removed after initial setup.
          </p>
        </div>
      </div>
    </div>
  );
}
