import { Menu } from "lucide-react";
import useUser from "@/utils/useUser";

export function Header() {
  const { data: user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center h-16">
        <a
          href="/"
          className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono flex items-center space-x-2"
        >
          <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs tracking-tighter">
            YT
          </span>
          <span>Clipper</span>
        </a>

        <div className="hidden sm:flex space-x-8 items-center">
          <a
            href="/#features"
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors font-jetbrains-mono text-sm"
          >
            Features
          </a>
          {user ? (
            <a
              href="/dashboard"
              className="px-5 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono text-sm"
            >
              Dashboard
            </a>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                href="/account/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono text-sm"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="px-5 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-jetbrains-mono text-sm"
              >
                Get Started
              </a>
            </div>
          )}
        </div>

        <button className="sm:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
