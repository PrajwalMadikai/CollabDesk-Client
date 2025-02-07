"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { name: "Dashboard", href: "?section=dashboard" },
  { name: "Profile", href: "?section=profile" },
  { name: "Settings", href: "?section=settings" },
];

interface SidebarContentProps {
  className?: string;
}

function SidebarContent({ className }: SidebarContentProps) {
  const searchParams = useSearchParams();
  const currentSection = searchParams.get("section") || "dashboard";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {menuItems.map((item) => (
        <Link key={item.name} href={item.href}>
          <Button
            variant={currentSection === item.href.split("=")[1] ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            {item.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 h-full bg-background border-r transition-transform duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : "w-12 -translate-x-0"
        )}
      >
        <div className="p-4 flex flex-col h-full">
          {isOpen && (
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Logo</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          {isOpen ? <SidebarContent /> : null}
        </div>
      </div>

      {/* Toggle Button (when collapsed) */}
      {!isOpen && (
        <div className="w-12 flex flex-col items-center justify-center bg-background border-r">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 ml-12 md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
