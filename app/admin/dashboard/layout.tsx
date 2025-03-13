"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddPayment from "../../../components/admin/AddPayment";
import Home from "../../../components/admin/AdminHome";
import Users from "../../../components/admin/Users";
import { SidebarProvider, SidebarTrigger } from "../../../components/ui/sidebar";
import { setAdmin } from "../../../store/slice/adminSlice";
import AppSidebar from "./page";

export default function Layout() {

  const [selectedMenu, setSelectedMenu] = useState<string>("home");
  const router=useRouter()
  const dispatch=useDispatch()

  useEffect(() => {
    const adminToken = localStorage.getItem('adminAccessToken');
    const adminData = localStorage.getItem('admin')

    if(adminData){
    const admin=JSON.parse(adminData)
    dispatch(setAdmin({id:admin.id,email:admin.email}))
    }

    if (!adminToken) {
      router.replace('/admin/login');
    }

  }, []);

  const renderContent = () => {
    switch (selectedMenu) {
      case "users":
        return <Users />;
      case "home":
        return <Home />;
      case "add-payment":
        return <AddPayment />;
      default:
        return (
           <Home/>
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
 