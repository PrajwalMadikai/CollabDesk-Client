"use client";
import AddPayment from "@/components/admin/AddPayment";
import Payments from "@/components/admin/Payments";
import Users from "@/components/admin/Users";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import AppSidebar from "./page";
 

export default function Layout({ children }: { children: React.ReactNode }) {
  const [selectedMenu, setSelectedMenu] = useState<string>("home");

  const renderContent = () => {
    switch (selectedMenu) {
      case "users":
        return <Users />;
      case "payments":
        return <Payments />;
      case "add-payment":
        return <AddPayment />;
      default:
        return <div className="w-full bg-black h-full p-6 text-black flex justify-center ">Welcome to the Admin Dashboard!</div>;
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
