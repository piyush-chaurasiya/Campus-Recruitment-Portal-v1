import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../components/common/ChangePasswordModal";

function RecruiterSettings() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <div className="max-w-5xl space-y-7">
      <div>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          RECRUITER
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mt-1">Settings</h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Configure your recruiter account, hiring preferences, and appearance.
        </p>
      </div>

      <div className="space-y-4">
        <Setting
          icon="🎨"
          title="Appearance"
          description="Switch between dark and light themes for your workspace."
        >
          <button
            onClick={toggleTheme}
            className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            {theme === "dark" ? "☀️ Switch to Light" : "🌙 Switch to Dark"}
          </button>
        </Setting>

        <Setting
          icon="🏢"
          title="Company Profile"
          description="Manage your organization's hiring details, website, and branding."
        >
          <button
            onClick={() => navigate("/recruiter/profile")}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer"
          >
            Edit Profile
          </button>
        </Setting>

        <Setting
          icon="🔔"
          title="Notifications"
          description="Receive notifications when students submit applications to your drives."
        >
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-blue-600"
            />
            <span className="text-sm font-medium">Application alerts enabled</span>
          </label>
        </Setting>

        <Setting
          icon="🔐"
          title="Security"
          description="Update your recruiter account password."
        >
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Change Password
          </button>
        </Setting>

        <Setting
          icon="🏫"
          title="Portal Info"
          description="Campus placement management system version."
        >
          <span className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold">
            Version 1.0 (Live)
          </span>
        </Setting>
      </div>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}

function Setting({ icon, title, description, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
          {icon}
        </div>

        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

export default RecruiterSettings;
