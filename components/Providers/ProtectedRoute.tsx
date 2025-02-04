"use client";
import { RootState } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AUTH_ROUTES = ["/login", "/signup", "/verify-email", "/email-sent"];
const PROTECTED_ROUTES = ["/workspace", "/settings", "/profile"];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage
        const userData = localStorage.getItem("user");
        
        // If no user data in localStorage, user is not authenticated
        if (!userData) {
          if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
            router.replace("/login");
          }
          setIsLoading(false);
          return;
        }

        // If user data exists in localStorage but not in Redux
        // They will be redirected appropriately based on Redux state
        // after useAuthInit updates it
        if (userData && !user.isAuthenticated) {
          setIsLoading(false);
          return;
        }

        // User is authenticated, prevent access to auth routes
        if (AUTH_ROUTES.some(route => pathname === route)) {
          router.replace("/");
        }
        
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user.isAuthenticated, router, pathname]);

  if (isLoading) {
    return null;
  }

  // Don't render protected routes content if not authenticated
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !user.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;