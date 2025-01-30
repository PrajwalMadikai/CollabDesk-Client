import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./page"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark">
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
     </div>
  )
}
