import { useApolloClient, useMutation } from "@apollo/client/react";
import { LogoutMutation } from "../graphql/mutations/user";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserShield } from "lucide-react";
import type { AuthUser } from "./ProtectRoute";

interface AdminProps{
    auth:AuthUser,
}

interface LogoutResponse {
  logout: boolean;
}

function Admin({ auth }: AdminProps) {
   const [logout] = useMutation<LogoutResponse>(LogoutMutation);
    const client = useApolloClient();
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        const {data} = await logout();
        if (data?.logout) {
          localStorage.removeItem("accessToken");
          toast.success("Logout successfully");
          await client.resetStore();
          navigate("/login", { replace: true });
        }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
     <div className="hidden md:flex dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-soft btn-error">
        <UserShield />
        {auth.name}
      </div>
      <ul
        tabIndex={-2}
        className="dropdown-content menu bg-base-100 text-rose-500 rounded-box z-1 w-52 p-2 shadow-sm mt-8"
      >
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <button
            onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  )
}

export default Admin;