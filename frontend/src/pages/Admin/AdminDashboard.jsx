import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminDashboard() {
  const user = JSON.parse(
    sessionStorage.getItem("user") || "{}"
  );

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/admin/dashboard"
      );

      setData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-5">
        <Header user={user} />

        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>

        <button
          onClick={loadDashboard}
          className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      <Header
        user={user}
        onRefresh={loadDashboard}
      />

      {data.pendingAcademicVerifications > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-bold">
                {data.pendingAcademicVerifications} Academic Verification Request{data.pendingAcademicVerifications > 1 ? "s" : ""} Pending
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Students have submitted updated 10th, 12th marks and CGPA awaiting admin approval.
              </p>
            </div>
          </div>
          <a
            href="/admin/academic-verification"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
          >
            Review Requests →
          </a>
        </div>
      )}

      {/* PRIMARY STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          icon="👥"
          title="Total Users"
          value={data.totalUsers}
          subtitle={`${data.activeUsers} active accounts`}
        />

        <StatCard
          icon="🎓"
          title="Students"
          value={data.students}
          subtitle="Registered students"
        />

        <StatCard
          icon="🏢"
          title="Recruiters"
          value={data.recruiters}
          subtitle="Recruiter accounts"
        />

        <StatCard
          icon="📢"
          title="Active Jobs"
          value={data.approvedJobs}
          subtitle={`${data.pendingJobs} pending approval`}
        />

      </div>

      {/* SECONDARY STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <MiniCard
          icon="👨‍💼"
          title="Placement Officers"
          value={data.placementOfficers}
        />

        <MiniCard
          icon="🛡️"
          title="Administrators"
          value={data.admins}
        />

        <MiniCard
          icon="💼"
          title="Total Jobs"
          value={data.totalJobs}
        />

        <MiniCard
          icon="📋"
          title="Applications"
          value={data.totalApplications}
        />

      </div>

      {/* OVERVIEW */}

      <div className="grid lg:grid-cols-3 gap-5">

        {/* USER OVERVIEW */}

        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold">
                Platform Overview
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Current system statistics
              </p>
            </div>

            <div className="text-2xl">
              📊
            </div>

          </div>

          <div className="space-y-5">

            <ProgressRow
              label="Students"
              value={data.students}
              total={data.totalUsers}
            />

            <ProgressRow
              label="Recruiters"
              value={data.recruiters}
              total={data.totalUsers}
            />

            <ProgressRow
              label="Placement Officers"
              value={data.placementOfficers}
              total={data.totalUsers}
            />

            <ProgressRow
              label="Administrators"
              value={data.admins}
              total={data.totalUsers}
            />

          </div>

        </div>

        {/* SYSTEM HEALTH */}

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl shadow-blue-600/10">

          <p className="text-blue-100 text-sm font-semibold">
            SYSTEM STATUS
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Everything looks good
          </h2>

          <p className="text-blue-100 text-sm mt-3 leading-relaxed">
            The placement platform is currently operational.
            Monitor users, opportunities and applications from
            the administration panel.
          </p>

          <div className="mt-7 space-y-3">

            <HealthItem
              label="Active Users"
              value={data.activeUsers}
            />

            <HealthItem
              label="Disabled Accounts"
              value={data.disabledUsers}
            />

            <HealthItem
              label="Pending Jobs"
              value={data.pendingJobs}
            />

          </div>

        </div>

      </div>

      {/* JOB ACTIVITY */}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Placement Activity
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Current job and application pipeline
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
            LIVE DATA
          </span>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">

          <ActivityCard
            icon="⏳"
            title="Awaiting Approval"
            value={data.pendingJobs}
            description="Jobs waiting for verification"
          />

          <ActivityCard
            icon="🚀"
            title="Published Opportunities"
            value={data.approvedJobs}
            description="Approved jobs visible to students"
          />

          <ActivityCard
            icon="📝"
            title="Applications"
            value={data.totalApplications}
            description="Total student applications"
          />

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div>

        <h2 className="text-xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <QuickAction
            icon="👥"
            title="Manage Users"
            description="Create and manage accounts"
            href="/admin/users"
          />

          <QuickAction
            icon="🎓"
            title="Academic Verification"
            description="Review student records"
            href="/admin/academic-verification"
          />

          <QuickAction
            icon="📢"
            title="Job Management"
            description="Review placement opportunities"
            href="/admin/jobs"
          />

          <QuickAction
            icon="⚙️"
            title="System Settings"
            description="Configure platform"
            href="/admin/settings"
          />

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   HEADER
===================================================== */

function Header({
  user,
  onRefresh,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

      <div>

        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          ADMINISTRATION
        </p>

        <h1 className="text-3xl md:text-4xl font-bold mt-1">
          Welcome, {user.name || "Administrator"} 👋
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Here's what's happening across your placement platform.
        </p>

      </div>

      <button
        onClick={onRefresh}
        className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition"
      >
        ↻ Refresh
      </button>

    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all">

      <div className="flex items-start justify-between">

        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-xl">
          {icon}
        </div>

        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          LIVE
        </span>

      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-5">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-1">
        {value}
      </h3>

      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        {subtitle}
      </p>

    </div>
  );
}

/* =====================================================
   MINI CARD
===================================================== */

function MiniCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4">

      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <p className="text-2xl font-bold mt-1">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =====================================================
   PROGRESS
===================================================== */

function ProgressRow({
  label,
  value,
  total,
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>

      <div className="flex justify-between text-sm mb-2">

        <span className="font-medium">
          {label}
        </span>

        <span className="text-slate-500 dark:text-slate-400">
          {value} · {percentage}%
        </span>

      </div>

      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">

        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

/* =====================================================
   HEALTH
===================================================== */

function HealthItem({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/10">

      <div className="flex items-center gap-2">

        <span className="w-2 h-2 rounded-full bg-emerald-300" />

        <span className="text-sm">
          {label}
        </span>

      </div>

      <span className="font-bold">
        {value}
      </span>

    </div>
  );
}

/* =====================================================
   ACTIVITY
===================================================== */

function ActivityCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="font-semibold mt-4">
        {title}
      </p>

      <p className="text-3xl font-bold mt-1">
        {value}
      </p>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {description}
      </p>

    </div>
  );
}

/* =====================================================
   QUICK ACTION
===================================================== */

function QuickAction({
  icon,
  title,
  description,
  href,
}) {
  return (
    <a
      href={href}
      className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1 transition-all"
    >

      <div className="text-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>

      <h3 className="font-bold mt-4">
        {title}
      </h3>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        {description}
      </p>

      <div className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-4">
        Open →
      </div>

    </a>
  );
}

/* =====================================================
   SKELETON
===================================================== */

function DashboardSkeleton() {
  return (
    <div className="space-y-7 animate-pulse">

      <div>
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />

        <div className="h-9 w-80 bg-slate-200 dark:bg-slate-800 rounded mt-3" />

        <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded mt-3" />
      </div>

      <div className="grid md:grid-cols-4 gap-5">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}

      </div>

      <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />

    </div>
  );
}

export default AdminDashboard;