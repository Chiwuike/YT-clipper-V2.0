export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 sm:gap-8">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <a
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono"
            >
              YT Clipper
            </a>
            <p className="text-gray-500 dark:text-gray-400 font-jetbrains-mono text-sm max-w-xs leading-relaxed">
              Automating the viral content pipeline for the next generation of
              digital creators. Built for speed, precision, and engagement.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono text-sm uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange-500 text-sm font-jetbrains-mono transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange-500 text-sm font-jetbrains-mono transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange-500 text-sm font-jetbrains-mono transition-colors"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange-500 text-sm font-jetbrains-mono transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-orange-500 text-sm font-jetbrains-mono transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs text-gray-400 font-jetbrains-mono">
            © 2026 YouTube Viral Clipper Created by Wuike and Wuikewrite. All
            rights reserved.
          </p>
          <div className="flex space-x-6 text-gray-400">
            <span className="text-xs font-jetbrains-mono">
              Status: All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
