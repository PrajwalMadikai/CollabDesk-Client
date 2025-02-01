"use client";

import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (!userData || !user.isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [user.isAuthenticated, router]);

  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return user.isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;