import { ChatMockup } from "./ChatMockup";

export function HeroSection() {
  return (
    <section className="pt-24 pb-12 sm:pb-20 bg-gray-50 dark:bg-[#1E1E1E] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-jetbrains-mono uppercase tracking-wider">
                Now in Public Beta
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-100 leading-tight font-jetbrains-mono">
              Turn YouTube Videos into{" "}
              <span className="text-orange-500 italic">Viral</span> Shorts
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl font-jetbrains-mono">
              The only autonomous clipping engine that monitors your channel,
              transcribes with Whisper AI, and extracts high-engagement moments
              while you sleep.
            </p>

            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="/account/signup"
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all text-center font-jetbrains-mono shadow-xl shadow-gray-900/10"
              >
                Start Clipping Free
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-center font-jetbrains-mono"
              >
                How it Works
              </a>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1E1E1E] bg-gray-200 dark:bg-gray-700"
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 font-jetbrains-mono">
                Joined by{" "}
                <span className="text-gray-900 dark:text-gray-100 font-bold">
                  1,200+
                </span>{" "}
                creators this week
              </p>
            </div>
          </div>

          <ChatMockup />
        </div>
      </div>
    </section>
  );
}
