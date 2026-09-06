import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import { useTheme } from "../../context/ThemeContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(
    sessionStorage.getItem("user") || "{}"
  );

  useEffect(() => {
    api.get("/api/admin/notifications/unread-count")
      .then((res) => setUnreadCount(res.data?.count || 0))
      .catch(() => {});
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "🏠",
    },
    {
      name: "User Management",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Students",
      path: "/admin/students",
      icon: "🎓",
    },
    {
      name: "Recruiters",
      path: "/admin/recruiters",
      icon: "🏢",
    },
    {
      name: "Placement Officers",
      path: "/admin/officers",
      icon: "👨‍💼",
    },
    {
      name: "Academic Verification",
      path: "/admin/academic-verification",
      icon: "📚",
    },
    {
      name: "Job Verification",
      path: "/admin/job-verification",
      icon: "💼",
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: "🔔",
    },
    {
      name: "Audit Logs",
      path: "/admin/logs",
      icon: "📜",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ];

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-200">

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
          className={`py-6 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 flex items-center ${
            collapsed ? "lg:justify-center lg:px-2 px-6" : "px-6"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
              🎓
            </div>

            <div
              className={`transition-opacity duration-200 ${
                collapsed ? "lg:hidden" : "block"
              }`}
            >
              <h1 className="text-lg font-bold truncate">
                Campus Portal
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Administration
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? link.name : ""}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 py-3 rounded-xl transition-all duration-200 relative",
                  collapsed ? "lg:justify-center lg:px-0 px-4" : "px-4",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white",
                ].join(" ")
              }
            >
              <span className="text-lg w-6 shrink-0 text-center">
                {link.icon}
              </span>

              <span
                className={`text-sm font-medium transition-opacity duration-200 truncate ${
                  collapsed ? "lg:hidden" : "block"
                }`}
              >
                {link.name}
              </span>

              {link.name === "Notifications" && unreadCount > 0 && (
                collapsed ? (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 lg:block hidden ring-2 ring-white dark:ring-slate-900" />
                ) : (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                    {unreadCount}
                  </span>
                )
              )}
            </NavLink>
          ))}
        </nav>

        {/* USER */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 transition-all duration-300">
          <div
            className={`flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">
              {user.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div
              className={`min-w-0 ${
                collapsed ? "lg:hidden" : "block"
              }`}
            >
              <p className="text-sm font-semibold truncate">
                {user.name || "Administrator"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email || "admin@campus.com"}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title={collapsed ? "Logout" : ""}
            className={`w-full flex items-center gap-3 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer ${
              collapsed ? "lg:justify-center lg:px-0 px-4" : "px-4"
            }`}
          >
            <span className="text-lg">🚪</span>
            <span
              className={`text-sm font-semibold ${
                collapsed ? "lg:hidden" : "inline"
              }`}
            >
              Logout
            </span>
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 flex flex-col">

        {/* HEADER */}
        <header className="sticky top-0 z-30 h-16 md:h-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 flex items-center justify-between px-4 sm:px-6 lg:px-8">

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
              <h2 className="font-bold text-slate-900 dark:text-white">
                Administration
              </h2>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                Campus Placement Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* THEME */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-center text-lg"
            >
              {theme === "dark"
                ? "☀️"
                : "🌙"}
            </button>

            {/* USER */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                {user.name
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </div>

              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user.name || "Admin"}
              </span>
            </div>

          </div>

        </header>

        {/* PAGE */}
        <section className="p-4 md:p-8 max-w-[1600px] w-full mx-auto flex-1">
          <Outlet />
        </section>

      </main>

    </div>
  );
}

export default AdminLayout;
