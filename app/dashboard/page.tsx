import ProtectedRoute from "@/components/Providers/ProtectedRoute"

const dashboardComponent=()=>{
    return<>
    <ProtectedRoute>
    <h2>Dashboard</h2>
    </ProtectedRoute>
    </>
}

export default dashboardComponent