import {
  Check,
  Scissors,
  Zap,
  Search,
  Monitor,
  Share2,
  Play,
  Cpu,
} from "lucide-react";

export function ProductMockup() {
  return (
    <div className="relative lg:pl-8 flex justify-center lg:justify-end">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden w-full max-w-lg">
        <div className="h-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded text-[10px] text-gray-500 font-jetbrains-mono">
            clipper.io/dashboard
          </div>
          <div className="w-3"></div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono italic uppercase tracking-tighter">
              My Channels
            </h3>
            <button className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded font-bold font-jetbrains-mono">
              + ADD CHANNEL
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Veritasium",
                status: "Monitoring",
                color: "text-blue-500",
              },
              {
                name: "Fireship",
                status: "Clipping",
                color: "text-orange-500 animate-pulse",
              },
              { name: "The Primeagen", status: "Idle", color: "text-gray-400" },
            ].map((channel, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    {channel.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold font-jetbrains-mono ${channel.color}`}
                >
                  {channel.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-400 font-jetbrains-mono mb-4">
              RECENT CLIPS
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[9/16] bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Play size={20} className="text-gray-300 mb-2" />
                <span className="text-[8px] text-gray-400 font-jetbrains-mono uppercase">
                  Preview
                </span>
              </div>
              <div className="aspect-[9/16] bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Play size={20} className="text-gray-300 mb-2" />
                <span className="text-[8px] text-gray-400 font-jetbrains-mono uppercase">
                  Preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "RSS Monitoring",
    desc: "We check your favorite channels 24/7. When a new video drops, we notice immediately.",
    icon: <Monitor className="text-blue-500" size={18} />,
  },
  {
    title: "Whisper Transcription",
    desc: "Full transcript generation using world-class AI models for pixel-perfect context.",
    icon: <Cpu className="text-orange-500" size={18} />,
  },
  {
    title: "Viral Score Analysis",
    desc: "Our engine detects humor, conflict, and high-energy moments using 4 unique signals.",
    icon: <Search className="text-green-500" size={18} />,
  },
  {
    title: "Smart FFmpeg Cutting",
    desc: "No cut-off sentences. We ensure every clip starts and ends on a logical beat.",
    icon: <Scissors className="text-purple-500" size={18} />,
  },
  {
    title: "Vertical 9:16 Export",
    desc: "Automatically crops and formats videos for TikTok, Reels, and YouTube Shorts.",
    icon: <Zap className="text-yellow-500" size={18} />,
  },
  {
    title: "Google Drive Sync",
    desc: "Clips are automatically uploaded to your Drive for easy sharing or further editing.",
    icon: <Share2 className="text-indigo-500" size={18} />,
  },
];

export function FeatureIntroductionSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 bg-white dark:bg-[#121212]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
          <div className="space-y-8 sm:space-y-10">
            <span className="inline-block px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-bold rounded-full uppercase tracking-widest font-jetbrains-mono">
              The Engine
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight font-jetbrains-mono">
              The full automation pipeline for viral content
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-jetbrains-mono">
              Stop spending hours scrubbing through footage. YouTube Clipper
              handles the entire workflow from detection to delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
                    {feature.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono text-sm leading-tight">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-jetbrains-mono leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ProductMockup />
        </div>
      </div>
    </section>
  );
}
