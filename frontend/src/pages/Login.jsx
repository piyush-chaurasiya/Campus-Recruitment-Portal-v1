import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

const roles = [
  {
    value: "STUDENT",
    label: "Student",
    icon: "🎓",
    description: "Find jobs & build your career",
  },
  {
    value: "RECRUITER",
    label: "Recruiter",
    icon: "🏢",
    description: "Hire talented students",
  },
  {
    value: "PLACEMENT_OFFICER",
    label: "Placement Officer",
    icon: "👨‍💼",
    description: "Manage campus placements",
  },
  {
    value: "ADMIN",
    label: "Admin",
    icon: "⚙️",
    description: "Manage the entire portal",
  },
];

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("STUDENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const user = response.data;

      if (user.role !== role) {
        setError(`This account is not registered as ${role}.`);
        return;
      }

      sessionStorage.setItem("token", user.token);

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );

      const routes = {
        STUDENT: "/student",
        RECRUITER: "/recruiter",
        PLACEMENT_OFFICER: "/placement",
        ADMIN: "/admin",
      };

      navigate(routes[user.role], { replace: true });

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#080d1a] dark:text-white">

      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-600/10" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-violet-600/10" />

      {/* TOP BAR */}

      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-lg">
            C
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-bold">
              Campus Portal
            </p>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Placement Management System
            </p>
          </div>
        </div>

        {/* THEME BUTTON */}

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          title="Toggle theme"
        >
          {darkMode ? "☀" : "☾"}
        </button>
      </div>

      {/* MAIN */}

      <main className="relative flex min-h-screen items-center justify-center px-4 py-24 sm:px-6">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/30 lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT SIDE */}

          <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">

            <div className="relative z-10">

              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-lg backdrop-blur">
                🎓
              </div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100">
                Campus Placement
              </p>

              <h1 className="max-w-md text-5xl font-extrabold leading-[1.08] tracking-tight">
                Build your career.
                <br />
                Find your opportunity.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-indigo-100">
                A unified platform connecting students, recruiters and
                placement teams to make campus recruitment simpler and
                smarter.
              </p>
            </div>

            <div className="relative z-10 space-y-4">

              {[
                "Discover relevant placement opportunities",
                "Track applications and interviews",
                "Connect students with leading recruiters",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-sm">
                    ✓
                  </span>

                  <span className="text-sm text-indigo-50">
                    {item}
                  </span>
                </div>
              ))}

            </div>

            {/* Decorative shapes */}

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl" />
          </section>

          {/* RIGHT SIDE */}

          <section className="p-6 sm:p-10 lg:p-12 xl:p-14">

            <div className="mx-auto max-w-xl">

              {/* HEADER */}

              <div className="mb-8">

                <div className="mb-4 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Secure Login
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Sign in to continue to your Campus Portal account.
                </p>

              </div>

              <form onSubmit={handleLogin}>

                {/* ROLE */}

                <div className="mb-7">

                  <div className="mb-3 flex items-center justify-between">

                    <label className="text-sm font-semibold">
                      Select your role
                    </label>

                    <span className="text-xs text-slate-400">
                      Step 1 of 2
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    {roles.map((item) => {
                      const selected = role === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            setRole(item.value);
                            setError("");
                          }}
                          className={`
                            group relative rounded-2xl border p-4 text-left
                            transition-all duration-200
                            hover:-translate-y-0.5
                            ${
                              selected
                                ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10 dark:border-indigo-400 dark:bg-indigo-500/10"
                                : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                            }
                          `}
                        >

                          <div className="flex items-start justify-between">

                            <span
                              className={`
                                flex h-10 w-10 items-center justify-center rounded-xl text-lg
                                ${
                                  selected
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white shadow-sm dark:bg-slate-700"
                                }
                              `}
                            >
                              {item.icon}
                            </span>

                            {selected && (
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                                ✓
                              </span>
                            )}

                          </div>

                          <p
                            className={`
                              mt-3 text-sm font-bold
                              ${
                                selected
                                  ? "text-indigo-700 dark:text-indigo-300"
                                  : ""
                              }
                            `}
                          >
                            {item.label}
                          </p>

                          <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-slate-400">
                            {item.description}
                          </p>

                        </button>
                      );
                    })}

                  </div>
                </div>

                {/* EMAIL */}

                <div className="mb-5">

                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      @
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      className="
                        w-full rounded-xl border border-slate-200
                        bg-slate-50 py-3.5 pl-11 pr-4
                        text-sm outline-none transition
                        placeholder:text-slate-400
                        focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10
                        dark:border-slate-700 dark:bg-slate-800/70
                        dark:placeholder:text-slate-500
                        dark:focus:border-indigo-400 dark:focus:bg-slate-800
                      "
                    />

                  </div>
                </div>

                {/* PASSWORD */}

                <div className="mb-3">

                  <label className="mb-2 block text-sm font-semibold">
                    Password
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      •
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      className="
                        w-full rounded-xl border border-slate-200
                        bg-slate-50 py-3.5 pl-11 pr-12
                        text-sm outline-none transition
                        placeholder:text-slate-400
                        focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10
                        dark:border-slate-700 dark:bg-slate-800/70
                        dark:placeholder:text-slate-500
                        dark:focus:border-indigo-400 dark:focus:bg-slate-800
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>

                  </div>
                </div>

                {/* FORGOT */}

                <div className="mb-6 flex justify-end">

                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>

                </div>

                {/* ERROR */}

                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                    <span className="mt-0.5">
                      ⚠
                    </span>

                    <span>
                      {error}
                    </span>

                  </div>
                )}

                {/* LOGIN */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group relative w-full overflow-hidden rounded-xl
                    bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600
                    bg-[length:200%_100%]
                    py-3.5 text-sm font-bold text-white
                    shadow-lg shadow-indigo-500/20
                    transition-all duration-300
                    hover:bg-[position:100%_0]
                    hover:-translate-y-0.5
                    hover:shadow-xl hover:shadow-indigo-500/25
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </span>
                  ) : (
                    `Login as ${
                      roles.find((r) => r.value === role)?.label
                    }`
                  )}
                </button>

              </form>

              {/* SECURITY INFO */}

              <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>🔒</span>
                <span>Your login session is securely protected.</span>
              </div>

              <p className="mt-6 text-center text-xs text-slate-400">
                Campus Placement Portal © 2026
              </p>

            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;