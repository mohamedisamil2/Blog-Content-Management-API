import { ChartNoAxesCombined, FileText, MessageCircle, PanelRightClose, Settings, SquarePen, Tag } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const sidebarLinks = [
  { to: "/admin/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/admin/posts/create", label: "Create Posts", icon: FileText },
  { to: "/admin/edit/posts", label: "Edit Posts", icon: SquarePen },
  { to: "/admin/categories/create", label: "Create Categories", icon: Tag },
  { to: "/admin/comments", label: "Comments", icon: MessageCircle },
];

function Dashboard() {
  return (
    <div className="drawer lg:drawer-open bg-white mt-16 border-t-2 border-rose-500">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <nav className="navbar w-full bg-white border-b-2 border-rose-500">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost drawer-button text-rose-500"
          >
            <PanelRightClose />
          </label>
          <div className="px-4 text-2xl font-medium text-rose-500">
            Admin Dashboard
          </div>
        </nav>

        <div className="p-6">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side border-r-2 border-rose-500">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

        <div className="flex min-h-full flex-col items-start bg-white is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow space-y-2 p-2">
            {sidebarLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                      isActive ? 'bg-rose-50 text-rose-600 font-medium' : 'text-rose-500 hover:bg-rose-50/50'
                    }`
                  }
                  data-tip={label}
                >
                  <Icon size={20} />
                  <span className="is-drawer-close:hidden">{label}</span>
                </NavLink>
              </li>
            ))}

            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                    isActive ? 'bg-rose-50 text-rose-600 font-medium' : 'text-rose-500 hover:bg-rose-50/50'
                  }`
                }
                data-tip="Settings"
              >
                <Settings size={20} />
                <span className="is-drawer-close:hidden">Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;