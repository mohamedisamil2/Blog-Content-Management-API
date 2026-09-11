import { Navigate } from "react-router-dom"
import IsLoading from "./IsLoading"

export interface AuthUser {
    id: string,
    name:string,
    email:string,
    role:string,
}

interface ProtectedRouteProps{
    children: React.ReactNode,
    auth: AuthUser | null | undefined,
    loading?:boolean,
    requireAdmin:boolean,
}

function ProtectRoute({ children, auth, loading,requireAdmin = false }:ProtectedRouteProps) {

    if (!auth) {
        return <Navigate to="/login" replace/>
    }
    if (loading) {
        return <IsLoading/>
    }

    if (requireAdmin && auth.role !== "admin") {
        return <Navigate to="/" replace/>
    }
    
    return <>{children}</>
}

export default ProtectRoute
