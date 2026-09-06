import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";

function StudentLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    api.get("/api/student/notifications/unread-count")
      .then((res) => setUnreadNotifications(res.data?.count || 0))
      .catch(() => {});
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const links = [
    {
      name: "Dashboard",
      path: "/student",
      icon: "⌂",
      end: true,
    },
    {
      name: "My Profile",
      path: "/student/profile",
      icon: "◉",
    },
    {
      name: "Resume",
      path: "/student/resume",
      icon: "▤",
    },
    {
      name: "Browse Jobs",
      path: "/student/jobs",
      icon: "▣",
    },
    {
      name: "Applications",
      path: "/student/applications",
      icon: "☷",
    },
    {
      name: "Interviews",
      path: "/student/interviews",
      icon: "◷",
    },
    {
      name: "Notifications",
      path: "/student/notifications",
      icon: "♢",
    },
    {
      name: "Settings",
      path: "/student/settings",
      icon: "⚙️"
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-white">

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-900
          transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "lg:w-20" : "lg:w-72"}
          w-72 shrink-0
        `}
      >

        {/* BRAND */}
        <div
          className={`h-16 md:h-20 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 flex items-center ${
            collapsed ? "lg:justify-center lg:px-2 px-6" : "px-6"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
              C
            </div>

            <div className={`transition-opacity duration-200 ${collapsed ? "lg:hidden" : "block"}`}>
              <h1 className="text-lg font-bold tracking-tight truncate">
                Campus Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Student workspace
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
          <p className={`mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${collapsed ? "lg:hidden" : "block"}`}>
            Workspace
          </p>

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.name : ""}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all duration-200 relative ${
                  collapsed ? "lg:justify-center lg:px-0 px-4" : "px-4"
                } ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base transition ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {link.icon}
                  </span>

                  <span className={`transition-opacity duration-200 truncate ${collapsed ? "lg:hidden" : "block"}`}>
                    {link.name}
                  </span>

                  {link.name === "Notifications" && unreadNotifications > 0 ? (
                    collapsed ? (
                      <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-indigo-600 lg:block hidden ring-2 ring-white dark:ring-slate-900" />
                    ) : (
                      <span className="ml-auto rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                        {unreadNotifications}
                      </span>
                    )
                  ) : (
                    isActive && (
                      <span className={`ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 ${collapsed ? "lg:hidden" : "block"}`} />
                    )
                  )}
                </>
              )}
            </NavLink>
          ))}

          <p className={`mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${collapsed ? "lg:hidden" : "block"}`}>
            Account
          </p>

          <NavLink
            to="/student/settings"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? "Settings" : ""}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition ${
                collapsed ? "lg:justify-center lg:px-0 px-4" : "px-4"
              } ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/70"
              }`
            }
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
              ⚙
            </span>

            <span className={`transition-opacity duration-200 truncate ${collapsed ? "lg:hidden" : "block"}`}>
              Settings
            </span>
          </NavLink>
        </nav>

        {/* USER CARD */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800 transition-all duration-300">
          <div className={`mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white">
              {(user.name || "S").charAt(0).toUpperCase()}
            </div>

            <div className={`min-w-0 ${collapsed ? "lg:hidden" : "block"}`}>
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user.name || "Student"}
              </p>

              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user.email || "student@campus.com"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title={collapsed ? "Logout" : ""}
            className={`flex w-full items-center gap-3 rounded-xl py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 cursor-pointer ${
              collapsed ? "lg:justify-center lg:px-0 px-4" : "px-4"
            }`}
          >
            <span className="text-lg">↪</span>
            <span className={collapsed ? "lg:hidden" : "inline"}>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-16 md:h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-lg transition cursor-pointer shadow-sm"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>

            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Student Portal
              </p>

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                My Workspace
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">

            {/* THEME */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* NOTIFICATION */}
            <button
              onClick={() => navigate("/student/notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer"
            >
              ♢
              {unreadNotifications > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* USER */}
            <div className="hidden items-center gap-3 sm:flex">

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user.name || "Student"}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-semibold text-white">
                {(user.name || "S").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
