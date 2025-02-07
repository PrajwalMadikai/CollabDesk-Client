import ProtectedRoute from "@/components/Providers/ProtectedRoute"
import SidebarLayout from "@/components/dashboard/sidebar"
const dashboardComponent=()=>{
    return<>
    <ProtectedRoute>
    <SidebarLayout>
        <h2>Hello this </h2>
    </SidebarLayout>
    </ProtectedRoute>
    </>
}

export default dashboardComponent