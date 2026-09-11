import {Menu, User} from "lucide-react"
import { Link } from 'react-router-dom'
import type { AuthUser } from "./ProtectRoute"
import Admin from "./Admin"

interface MenuMobileProps{
    auth:AuthUser | null | undefined,
}

function MenuMobile({auth}:MenuMobileProps) {
  return (
    <div className="dropdown dropdown-end md:hidden lg:hidden xl:hidden">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        <Menu/>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-50 w-56 p-2 shadow-lg"
      >
        <li>
          <Link to="/" className="text-red-600">Home</Link>
        </li>

        <li>
          <Link to="/post">Post</Link>
        </li>

        <li>
          <Link to="/category">Categories</Link>
        </li>
        {!auth ? (
          <>
            <li>
              <Link to="/login">Sign In</Link>
            </li>

            <li>
              <Link to="/register">Sign Up</Link>
            </li>
          </>
        ) : (
          <>{auth.role === "admin" ? <Admin auth={auth} /> : <User />}</>
        )}
      </ul>
    </div>
  )
}

export default MenuMobile