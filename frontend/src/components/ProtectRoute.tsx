import { Navigate } from "react-router-dom"

export interface AuthUser {
    id: string,
    name:string,
    email:string,
    role:string,
}

interface ProtectedRouteProps{
    children: React.ReactNode,
    auth: AuthUser | null | undefined,
    requireAdmin:boolean,
}

function ProtectRoute({ children, auth, requireAdmin = false }:ProtectedRouteProps) {

    if (!auth) {
        return <Navigate to="/login" replace/>
    }

    if (requireAdmin && auth.role !== "admin") {
        return <Navigate to="/" replace/>
    }
    
    return <>{children}</>
}

export default ProtectRoute
