"use client";
import AddPayment from "@/components/admin/AddPayment";
import Payments from "@/components/admin/Payments";
import Users from "@/components/admin/Users";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppSidebar from "./page";

export default function Layout({ children }: { children: React.ReactNode }) {

  const [selectedMenu, setSelectedMenu] = useState<string>("home");
  const router=useRouter()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminAccessToken');
    if (!adminToken) {
      router.replace('/admin/login');
    }
  }, [router]);

  const renderContent = () => {
    switch (selectedMenu) {
      case "users":
        return <Users />;
      case "payments":
        return <Payments />;
      case "add-payment":
        return <AddPayment />;
      default:
        return (
          <div className="w-full h-full flex justify-center items-center bg-black">
            <img src="/collabdesk white logo.png" alt="Admin Dashboard Logo" className="h-[170px] w-auto md:h-[155px]" />
          </div>
        );
    }
  };

  return (
    <div className="dark flex">
      <SidebarProvider>
        <AppSidebar onSelectMenu={setSelectedMenu} />
        <main className="flex-1 bg-black  overflow-auto">
          <SidebarTrigger style={{ color: "white"}} >
          
            </SidebarTrigger>
          {renderContent()}
        </main>
      </SidebarProvider>
    </div>
  );
}
