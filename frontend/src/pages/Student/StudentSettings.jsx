import { useEffect, useState } from "react";
import ChangePasswordModal from "../../components/common/ChangePasswordModal";

function StudentSettings() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [notifications, setNotifications] = useState(true);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [interviewUpdates, setInterviewUpdates] = useState(true);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      dark
    );

    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <div className="max-w-4xl space-y-7">

      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          PREFERENCES
        </p>

        <h1 className="text-3xl md:text-4xl font-bold">
          Settings
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Manage your account, appearance and notifications.
        </p>
      </div>

      {/* APPEARANCE */}
      <Section
        title="Appearance"
        description="Customize how the portal looks."
      >

        <SettingRow
          icon="🎨"
          title="Theme"
          description={
            dark
              ? "Dark mode is currently enabled."
              : "Light mode is currently enabled."
          }
        >
          <button
            onClick={() => setDark(!dark)}
            className={`relative w-14 h-8 rounded-full transition ${
              dark
                ? "bg-blue-600"
                : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition ${
                dark
                  ? "left-7"
                  : "left-1"
              }`}
            />
          </button>
        </SettingRow>

      </Section>

      {/* NOTIFICATIONS */}
      <Section
        title="Notifications"
        description="Choose which updates you want to receive."
      >

        <SettingRow
          icon="🔔"
          title="All Notifications"
          description="Enable or disable placement notifications."
        >
          <Toggle
            value={notifications}
            onChange={setNotifications}
          />
        </SettingRow>

        <SettingRow
          icon="📋"
          title="Application Updates"
          description="Get notified when your application status changes."
        >
          <Toggle
            value={applicationUpdates}
            onChange={setApplicationUpdates}
            disabled={!notifications}
          />
        </SettingRow>

        <SettingRow
          icon="📅"
          title="Interview Updates"
          description="Receive interview scheduling and reminder notifications."
        >
          <Toggle
            value={interviewUpdates}
            onChange={setInterviewUpdates}
            disabled={!notifications}
          />
        </SettingRow>

      </Section>

      {/* ACCOUNT */}
      <Section
        title="Account & Security"
        description="Manage your account security."
      >

        <SettingRow
          icon="🔐"
          title="Change Password"
          description="Update your account password."
        >
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Change
          </button>
        </SettingRow>

        <SettingRow
          icon="👤"
          title="Account"
          description="Manage your profile information."
        >
          <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Manage
          </button>
        </SettingRow>

      </Section>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

    </div>
  );
}

function Section({
  title,
  description,
  children,
}) {
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">

      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold">
          {title}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {description}
        </p>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {children}
      </div>

    </section>
  );
}

function SettingRow({
  icon,
  title,
  description,
  children,
}) {
  return (
    <div className="flex items-center justify-between gap-5 px-6 py-5">

      <div className="flex items-start gap-4">

        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {icon}
        </div>

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {description}
          </p>
        </div>

      </div>

      {children}

    </div>
  );
}

function Toggle({
  value,
  onChange,
  disabled = false,
}) {
  return (
    <button
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={`relative w-12 h-7 rounded-full transition ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : value
          ? "bg-blue-600"
          : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition ${
          value
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  );
}

export default StudentSettings;