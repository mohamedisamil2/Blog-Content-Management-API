import { Link } from "react-router-dom"

function MenuDesktop() {

    const borderStyle =
        "relative py-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-rose-500 after:transition-all after:duration-300 hover:after:w-full" ;

  return (
    <div className="hidden md:flex items-center gap-6">
      <Link to="/" className={`${borderStyle}`}
          >
        <h3 className="text-xl font-medium ">
          Home
        </h3>
      </Link>
      <Link to="/post"className={`${borderStyle}`} >
        <h3 className="text-xl font-medium ">
          Posts
        </h3>
      </Link>
      <Link to="/category" className={`${borderStyle}`}>
        <h3 className="text-xl font-medium ">
          Categories
        </h3>
      </Link>
    </div>
  )
}

export default MenuDesktop