/**
 * Storage Settings Page
 *
 * Allows users to choose where their generated clips are stored:
 * - Cloudinary (default, fast, public URLs)
 * - Google Drive (custom email, private storage)
 */

"use client";

import { useState, useEffect } from "react";
import { Cloud, HardDrive, Save, Check } from "lucide-react";
import useUser from "@/utils/useUser";

export default function SettingsPage() {
  const { data: user } = useUser();
  const [storageProvider, setStorageProvider] = useState("cloudinary");
  const [customDriveEmail, setCustomDriveEmail] = useState("");
  const [driveStatus, setDriveStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
    checkDriveStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/user/settings");
      const data = await response.json();
      if (data.storage_provider) {
        setStorageProvider(data.storage_provider);
      }
      if (data.custom_drive_email) {
        setCustomDriveEmail(data.custom_drive_email);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const checkDriveStatus = async () => {
    try {
      const response = await fetch("/api/storage/google-drive");
      const data = await response.json();
      setDriveStatus(data);
    } catch (error) {
      console.error("Failed to check Drive status:", error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storage_provider: storageProvider,
          custom_drive_email: customDriveEmail,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Storage Settings</h1>
        <p className="text-gray-400 mb-8">
          Choose where your generated clips will be stored
        </p>

        {/* Storage Provider Selection */}
        <div className="space-y-4 mb-8">
          {/* Cloudinary Option */}
          <div
            onClick={() => setStorageProvider("cloudinary")}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              storageProvider === "cloudinary"
                ? "border-orange-500 bg-orange-500/10"
                : "border-[#2A2A2A] bg-[#1E1E1E] hover:border-[#3A3A3A]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Cloud className="text-orange-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Cloudinary
                    <span className="ml-3 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Fast, reliable cloud storage with instant public URLs
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>✓ Instant video streaming</li>
                    <li>✓ No setup required</li>
                    <li>✓ Optimized delivery</li>
                    <li>✓ Built-in video player</li>
                  </ul>
                </div>
              </div>
              {storageProvider === "cloudinary" && (
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Google Drive Option */}
          <div
            onClick={() => setStorageProvider("google_drive")}
            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
              storageProvider === "google_drive"
                ? "border-blue-500 bg-blue-500/10"
                : "border-[#2A2A2A] bg-[#1E1E1E] hover:border-[#3A3A3A]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <HardDrive className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Google Drive</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Store clips in a Google Drive account of your choice
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>✓ Private storage</li>
                    <li>✓ Custom email support</li>
                    <li>✓ Organize in folders</li>
                    <li>✓ Access from anywhere</li>
                  </ul>
                </div>
              </div>
              {storageProvider === "google_drive" && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Google Drive Custom Email */}
        {storageProvider === "google_drive" && (
          <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A] mb-8">
            <h3 className="text-lg font-bold mb-4">
              Google Drive Configuration
            </h3>

            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">
                Google Account Email (optional)
              </label>
              <input
                type="email"
                value={customDriveEmail}
                onChange={(e) => setCustomDriveEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 bg-[#0F0F0F] border border-[#2A2A2A] rounded-xl text-white outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">
                Leave blank to use the connected Google account
              </p>
            </div>

            {driveStatus?.connected ? (
              <div className="flex items-center space-x-2 text-green-500 text-sm">
                <Check size={16} />
                <span>Connected: {driveStatus.email}</span>
              </div>
            ) : (
              <a
                href={driveStatus?.authUrl}
                className="inline-block px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Connect Google Drive
              </a>
            )}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveSettings}
          disabled={saving || saved}
          className={`w-full px-6 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center space-x-2 ${
            saved ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {saved ? (
            <>
              <Check size={20} />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
