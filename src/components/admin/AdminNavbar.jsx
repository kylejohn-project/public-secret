import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  clearAdminSession,
  getAdminToken,
} from "../../services/adminAuth";


const API_URL =
  import.meta.env.VITE_APPS_SCRIPT_URL;


export default function AdminNavbar() {
  const navigate =
    useNavigate();

  const links = [
    {
      label: "Dashboard",
      path: "/admin",
      end: true,
    },
    {
      label: "Orders",
      path: "/admin/orders",
    },
    {
      label: "Check In",
      path: "/admin/check-in",
    },
  ];


  async function handleLogout() {
    const token =
      getAdminToken();

    try {
      if (token) {
        await fetch(API_URL, {
          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8",
          },

          body: JSON.stringify({
            action: "adminLogout",
            token,
          }),
        });
      }
    } catch (error) {
      console.error(error);
    }

    clearAdminSession();

    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  }


  return (
    <header className="border-b border-orange-900/20 bg-black">

      <div className="mx-auto max-w-7xl px-6 md:px-10">

        <div className="flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">

          <p className="text-xs font-black uppercase tracking-[0.25em]">
            Public Secret
            <span className="ml-2 text-ps-red">
              Admin
            </span>
          </p>


          <nav className="flex flex-wrap items-center gap-5">

            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `text-[10px] font-bold uppercase tracking-[0.2em] transition ${
                    isActive
                      ? "text-ps-red"
                      : "text-white/40 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}


            <button
              type="button"
              onClick={handleLogout}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 transition hover:text-red-400"
            >
              Logout
            </button>

          </nav>

        </div>

      </div>

    </header>
  );
}