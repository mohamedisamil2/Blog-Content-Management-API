import { Navigate } from "react-router-dom";
import type { AuthUser } from "./ProtectRoute";

function GuestRoute({ children, auth }: { children: React.ReactNode;  auth:AuthUser | null | undefined}) {
  
    if (auth) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>
}

export default GuestRoute