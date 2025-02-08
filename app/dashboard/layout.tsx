"use client";
import { setUser } from "@/store/slice/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "./sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const dispatch=useDispatch()
    useEffect(() => {
      const userFetch = localStorage.getItem('user');
      
      if (userFetch) {
        const userData = JSON.parse(userFetch);
        if (userData) {
            dispatch(setUser({
            id: userData.id,
            fullname: userData.fullname,
            email: userData.email,
            workSpaces: userData.workSpaces,
            isAuthenticated: true,
          }));
        }
      }
    }, [dispatch]);

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar (always visible) */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 p-6 ml-64">{children}</div>
    </div>
  );
}
