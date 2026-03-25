import { useState } from "react";
import {
  Plus,
  Trash2,
  ExternalLink,
  Youtube,
  Clock,
  Scissors,
  Monitor,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";

export default function ChannelsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [minLen, setMinLen] = useState(20);
  const [maxLen, setMaxLen] = useState(60);

  const queryClient = useQueryClient();

  const { data: channels, isLoading } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch("/api/channels");
      if (!res.ok) throw new Error("Failed to fetch channels");
      return res.json();
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add channel");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["channels"]);
      setIsAdding(false);
      setNewUrl("");
      toast.success("Channel added successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/channels?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete channel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["channels"]);
      toast.success("Channel removed.");
    },
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newUrl.includes("youtube.com")) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }
    addMutation.mutate({ youtubeUrl: newUrl, minLen, maxLen });
  };

  return (
    <div className="space-y-8">
      <Toaster position="bottom-right" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            My Channels
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-jetbrains-mono mt-1">
            Manage the YouTube channels you're monitoring for viral content.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold font-jetbrains-mono hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          <span>{isAdding ? "Cancel" : "Add Channel"}</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-orange-200 dark:border-orange-900/50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 font-jetbrains-mono">
                YouTube Channel URL
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Youtube size={18} />
                </div>
                <input
                  required
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://youtube.com/@MrBeast"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 font-jetbrains-mono flex items-center space-x-2">
                  <Clock size={14} /> <span>Min Clip Length (sec)</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="59"
                  value={minLen}
                  onChange={(e) => setMinLen(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 font-jetbrains-mono flex items-center space-x-2">
                  <Scissors size={14} /> <span>Max Clip Length (sec)</span>
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={maxLen}
                  onChange={(e) => setMaxLen(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addMutation.isLoading}
              className="w-full py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold font-jetbrains-mono hover:bg-gray-800 dark:hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              {addMutation.isLoading
                ? "Validating Channel..."
                : "Confirm & Start Monitoring"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : channels?.length > 0 ? (
          channels.map((channel) => (
            <div
              key={channel.id}
              className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500">
                  <Youtube size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    {channel.channel_name || "Syncing..."}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-jetbrains-mono truncate max-w-[200px] sm:max-w-md">
                    {channel.youtube_url}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-[10px] text-gray-400 font-jetbrains-mono uppercase flex items-center space-x-1">
                      <Clock size={10} />{" "}
                      <span>
                        {channel.clip_length_min}-{channel.clip_length_max}s
                        clips
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={channel.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  onClick={() => deleteMutation.mutate(channel.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#1E1E1E] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <Monitor
              className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
              size={48}
            />
            <p className="text-gray-500 dark:text-gray-400 font-jetbrains-mono">
              No channels added yet. Add your first channel to start clipping.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
