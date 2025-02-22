"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { clearAdmin, setAdmin } from "@/store/slice/adminSlice";
import { AppDispatch, RootState } from "@/store/store";
import axios from "axios";
import { Home, LogOut, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const user = {
  name: "Admin User",
  email: "admin@example.com",
  avatar: "/path/to/avatar.jpg",
};

 

const items = [
  { title: "Home", key: "home", icon: Home },
  { title: "Users", key: "users", icon: Users },
  { title: "Add Payment", key: "add-payment", icon: Plus },
];

const AppSidebar = ({ onSelectMenu }: { onSelectMenu: (key: string) => void }) => {
  const dispatch=useDispatch<AppDispatch>()
   const router=useRouter()
   const admin=useSelector((state:RootState)=>state.admin)
   useEffect(()=>{
     const admin=localStorage.getItem('admin')
     if(admin)
     {
       let data=JSON.parse(admin)
       dispatch(setAdmin({id:data.id,email:data.email}))
     }
   },[])
  const Logout=async()=>{
    
    try {
  
      const response= await axios.post(`http://localhost:5713/admin/logout`, {}, { withCredentials: true })
       
  
        if (response.status === 200) {
          toast.success("Logout successful!", {
            duration: 2000,
            position: "top-right",
            style: { background: "#28a745", color: "#fff" },
            
          });
           localStorage.removeItem('admin');
           localStorage.removeItem('adminAccessToken');
           dispatch(clearAdmin())
           router.replace('/admin/login')
        }
    } catch (error) {
      console.log(error);
      toast.error("Error during logout", {
        duration: 2000,
        position: "top-right",
      });
    }
  }

  return (
    <Sidebar className="h-screen w-[260px] bg-black text-white shadow-xl rounded-r-3xl flex flex-col items-center">
      <div className="text-lg  text-white text-center mt-6 uppercase tracking-tight">
        Admin Dashboard
      </div>

      <SidebarContent className="flex-1 flex flex-col justify-center w-full">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col items-center gap-6 mt-8 w-full">
            <SidebarMenu className="w-full">
              {items.map((item) => (
                <SidebarMenuItem key={item.key} className="w-full">
                  <SidebarMenuButton
                    asChild
                    onClick={() => onSelectMenu(item.key)}
                    className="flex flex-col items-center w-full h-14 p-4 border border-gray-600 rounded-[2px] bg-gray-800 hover:bg-gray-700 hover:scale-105 transition-all duration-200"
                  >
                    <button className="flex flex-col items-center space-y-2 w-full">
                      <span className="text-md font-bold">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 🔹 User Section at the Bottom */}
      <div className="p-6 border-t border-gray-700 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-center space-x-3 p-3">
            
            <span className="text-md font-sm text-gray-200">{admin.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="text-white hover:bg-gray-700">Subscription</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={Logout} className="text-red-600 text-md font-semibold">
              <LogOut className="mr-2 "  /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
