import { Header } from "@/components/Header/Header";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import useUser from "@/utils/useUser";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const { data: user, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/account/signin?callbackUrl=/dashboard";
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <Header />
      <div className="flex pt-16 h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
