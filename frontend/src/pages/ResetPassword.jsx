import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing or invalid password reset token.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/reset-password", {
        token,
        newPassword,
        confirmPassword,
      });

      setMessage(
        response.data?.message ||
          "Password has been reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link may be expired or already used."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-white flex flex-col justify-center items-center p-4 relative">
      {/* THEME TOGGLE */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center text-lg cursor-pointer shadow-sm"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20 font-bold mb-4">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create a secure new password for your account.
          </p>
        </div>

        {!token && (
          <div className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm">
            ⚠️ No reset token provided. Please use the link provided in your email or password reset request.
          </div>
        )}

        {message && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        {token && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm cursor-pointer"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-60 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
