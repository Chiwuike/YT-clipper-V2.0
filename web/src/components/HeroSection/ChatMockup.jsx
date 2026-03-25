import { Play, TrendingUp, Cpu } from "lucide-react";

export function ChatMockup() {
  return (
    <div className="relative lg:pl-8 flex justify-center lg:justify-end">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl dark:shadow-none dark:ring-1 dark:ring-gray-800 p-6 sm:p-8 w-full max-w-sm">
        <div className="flex items-center justify-between mb-8 border-b dark:border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="text-orange-500" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono leading-none">
                Clipper Bot
              </h3>
              <p className="text-[10px] text-green-500 font-jetbrains-mono">
                Processing Active
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 max-w-[90%] self-start border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-900 dark:text-gray-200 font-jetbrains-mono leading-relaxed">
                Found a new video from{" "}
                <span className="text-orange-500">@MrBeast</span>. Starting 24h
                cooldown...
              </p>
            </div>
            <span className="text-[9px] text-gray-400 font-jetbrains-mono px-2">
              11:02 AM
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="bg-orange-500 rounded-2xl p-4 max-w-[90%] self-end shadow-lg shadow-orange-500/20">
              <p className="text-xs text-white font-jetbrains-mono leading-relaxed">
                Transcribing audio with Whisper AI... 84% complete
              </p>
            </div>
            <span className="text-[9px] text-gray-400 font-jetbrains-mono self-end px-2">
              1:15 PM
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 max-w-[90%] self-start border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <p className="text-xs text-gray-900 dark:text-gray-200 font-jetbrains-mono font-bold">
                  Generated Clips:
                </p>
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-2 rounded-lg border dark:border-gray-700">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <Play size={12} className="text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-900 dark:text-gray-200 font-jetbrains-mono truncate">
                      Viral Moment #1
                    </p>
                    <p className="text-[8px] text-gray-400 font-jetbrains-mono">
                      Score: 9.8/10
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <span className="text-[9px] text-gray-400 font-jetbrains-mono px-2">
              1:20 PM
            </span>
          </div>
        </div>

        <div className="mt-8 relative">
          <input
            type="text"
            readOnly
            placeholder="System processing..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs text-gray-500 font-jetbrains-mono focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Cpu size={14} className="text-orange-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
