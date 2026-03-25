import { useState } from "react";
import {
  Play,
  Download,
  Share2,
  Search,
  Filter,
  TrendingUp,
  MoreVertical,
  Video,
  Cloud,
  HardDrive,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ClipsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: clips, isLoading } = useQuery({
    queryKey: ["clips", filter, search],
    queryFn: async () => {
      const params = new URLSearchParams({ filter, search });
      const res = await fetch(`/api/clips?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch clips");
      return res.json();
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            Generated Clips
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-jetbrains-mono mt-1">
            Every viral moment, perfectly cropped and ready for export.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-jetbrains-mono text-xs w-full sm:w-64"
            />
          </div>
          <button className="p-2.5 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-400 hover:text-orange-500 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 border-b dark:border-gray-800 pb-1 overflow-x-auto no-scrollbar">
        {["all", "high-score", "recent", "shared"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs font-bold font-jetbrains-mono uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
              filter === tab
                ? "border-orange-500 text-orange-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="aspect-[9/16] bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : clips?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="group relative aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:scale-[1.02] transition-all cursor-pointer border border-gray-100 dark:border-gray-800"
            >
              {/* Video Thumbnail or Player */}
              {clip.video_url ? (
                <video
                  src={clip.video_url}
                  poster={clip.thumbnail_url}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  controls={false}
                />
              ) : (
                <img
                  src={
                    clip.thumbnail_url ||
                    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400"
                  }
                  alt={clip.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
              )}

              {/* Storage Provider Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded font-jetbrains-mono">
                {clip.storage_provider === "cloudinary" ? (
                  <>
                    <Cloud size={10} />
                    <span>Cloudinary</span>
                  </>
                ) : (
                  <>
                    <HardDrive size={10} />
                    <span>Drive</span>
                  </>
                )}
              </div>

              {/* Viral Score Badge */}
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded font-jetbrains-mono flex items-center space-x-1">
                <TrendingUp size={10} />{" "}
                <span>{clip.score?.toFixed(1) || "N/A"}</span>
              </div>

              {/* More Options */}
              <button className="absolute top-12 right-3 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white/80 hover:text-white hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={14} />
              </button>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={clip.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40"
                >
                  <Play className="text-white ml-1" size={20} />
                </a>
              </div>

              {/* Bottom Action Bar */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs font-bold text-white font-jetbrains-mono truncate mb-3">
                  {clip.title ||
                    `Clip ${Math.floor(clip.start_time)}s-${Math.floor(clip.end_time)}s`}
                </p>
                <div className="flex items-center justify-between">
                  <a
                    href={clip.video_url}
                    download
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Download"
                  >
                    <Download size={14} />
                  </a>
                  <a
                    href={clip.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    title="Open in new tab"
                  >
                    <Share2 size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
          <Video
            className="mx-auto text-gray-200 dark:text-gray-800 mb-6"
            size={64}
          />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            No clips found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-jetbrains-mono mt-2 max-w-xs mx-auto">
            Make sure you have channels added and allow up to 24 hours for
            processing.
          </p>
          <a
            href="/dashboard/channels"
            className="inline-block mt-8 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold font-jetbrains-mono text-sm"
          >
            Go to Channels
          </a>
        </div>
      )}
    </div>
  );
}
