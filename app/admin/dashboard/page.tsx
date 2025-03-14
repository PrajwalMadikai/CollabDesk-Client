"use client";
import { Home, LogOut, Plus, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar";
import { useAdminSidebar } from "../../../hooks/useAdminhook";

interface AppSidebarProps {
  onSelectMenu: (key: string) => void;
}

const items = [
  { title: "Home", key: "home", icon: Home },
  { title: "Users", key: "users", icon: Users },
  { title: "Add Payment", key: "add-payment", icon: Plus },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ onSelectMenu }) => {
  const { admin, handleLogout } = useAdminSidebar();

  return (
    <Sidebar className="h-screen w-[260px] bg-black text-white shadow-xl rounded-r-3xl flex flex-col items-center">
      <div className="text-lg text-white text-center mt-6 uppercase tracking-tight">
        Admin Dashboard
      </div>

      <SidebarContent className="flex-1 flex flex-col w-full">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-3 mt-8 px-4">
            <SidebarMenu className="w-full">
              {items.map((item) => (
                <SidebarMenuItem key={item.key} className="w-full">
                  <SidebarMenuButton
                    asChild
                    onClick={() => onSelectMenu(item.key)}
                    className="group flex items-center w-full h-12 px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-700 transition-all duration-200"
                  >
                    <button className="flex items-center space-x-4 w-full text-left">
                      <item.icon
                        size={20}
                        className="text-gray-400 group-hover:text-white transition-colors duration-200"
                      />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200">
                        {item.title}
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-6 border-t border-gray-700 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-center space-x-3 p-3">
              <span className="text-md font-sm text-gray-200">{admin.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 text-md font-semibold">
              <LogOut className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;