import { Link } from "react-router-dom";
import Admin from "./Admin";
import Logo from "./Logo";
import MenuMobile from "./MenuMobile";
import MenuDesktop from "./MenuDesktop";
import type { AuthUser } from "./ProtectRoute";
import User from "./User";
import { LogIn, LogOut } from "lucide-react";

interface NavbarProps {
  auth: AuthUser | null | undefined;
}
function Navbar({auth}:NavbarProps) {
    return (
    <header
        className={`fixed top-0 z-50 min-w-full bg-white shadow-sm ${auth?.role === "admin" ? "m-0" : "mb-12"} `}>      
        <nav className="container mx-auto flex items-center justify-between gap-8 h-16 ">
            <Logo/>
            {auth?.role !== "admin" && <MenuDesktop />}
            <MenuMobile auth={auth} />
            {!auth ? (
        <div className="hidden md:flex items-center gap-4 ">
            <Link
                to="/login"
                className="flex items-center text-xs font-medium text-rose-500 hover:text-rose-400 transition-colors gap-1"
            >
                <h3 className="">Sign In</h3>
                <LogIn className="" />
            </Link>
            <Link
                to="/register"
                className="flex items-center text-xs font-medium text-rose-500 hover:text-rose-400 transition-colors gap-1 "
            >
                <h3 className="">Sing Up</h3>
                <LogOut/>
            </Link>
        </div>
            ) : (
          <>{auth.role === "admin" ? <Admin /> : <User auth={auth}/>}</>
        )}   
        </nav>
    </header>
  )
}

export default Navbar
