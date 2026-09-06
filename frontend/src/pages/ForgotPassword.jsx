import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetLink, setResetLink] = useState("");

  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetLink("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(
        response.data?.message ||
          "If this email is registered, password reset instructions have been generated."
      );

      if (response.data?.resetLink) {
        setResetLink(response.data.resetLink);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process password reset request."
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
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20 font-bold mb-4">
            🔑
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Forgot Password
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter your email to receive a secure password reset link.
          </p>
        </div>

        {message && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm space-y-2">
            <p>✓ {message}</p>
            {resetLink && (
              <div className="pt-2 border-t border-emerald-200 dark:border-emerald-500/20">
                <Link
                  to={resetLink}
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Proceed to Reset Password →
                </Link>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Registered Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@campus.com"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-60 shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            {loading ? "Generating Link..." : "Send Reset Link"}
          </button>
        </form>

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

export default ForgotPassword;
