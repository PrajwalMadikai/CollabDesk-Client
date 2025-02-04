"use client";
import { RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AUTH_ROUTES = ["/login", "/signup", "/verify-email", "/email-sent"];
const PROTECTED_ROUTES = ["/workspace", "/dashboard"];

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem("user");
        
        if (!userData) {
          if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
            router.replace("/login");
          }
          setIsLoading(false);
          return;
        }

        if (userData && !user.isAuthenticated) {
          setIsLoading(false);
          return;
        }

        if (AUTH_ROUTES.some(route => pathname === route)) {
          await router.replace("/");
        }
        
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        if (!AUTH_ROUTES.some(route => pathname === route)) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, [user.isAuthenticated, router, pathname]);

  if (isLoading || AUTH_ROUTES.some(route => pathname === route && user.isAuthenticated)) {
    return <LoadingSpinner />;
  }

  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !user.isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;