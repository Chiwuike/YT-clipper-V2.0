import {
  LayoutDashboard,
  Monitor,
  Video,
  Settings,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const menuItems = [
    {
      name: "Overview",
      icon: <LayoutDashboard size={18} />,
      href: "/dashboard",
    },
    {
      name: "My Channels",
      icon: <Monitor size={18} />,
      href: "/dashboard/channels",
    },
    {
      name: "Generated Clips",
      icon: <Video size={18} />,
      href: "/dashboard/clips",
    },
    {
      name: "Settings",
      icon: <Settings size={18} />,
      href: "/dashboard/settings",
    },
  ];

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#1E1E1E] border-r border-gray-200 dark:border-gray-800 p-4">
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-jetbrains-mono text-sm transition-all ${
                isActive
                  ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <a
          href="/account/logout"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl font-jetbrains-mono text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
  );
}
