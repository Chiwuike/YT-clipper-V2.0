import { useEffect } from "react";
import useAuth from "@/utils/useAuth";

function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    };
    performLogout();
  }, [signOut]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#121212]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono text-lg">
          Signing you out...
        </p>
      </div>
    </div>
  );
}

export default LogoutPage;
