import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes, interviewsRes, profileRes] = await Promise.allSettled([
        api.get("/api/student/jobs"),
        api.get("/api/student/applications"),
        api.get("/api/student/interviews"),
        api.get("/api/student/profile"),
      ]);

      if (jobsRes.status === "fulfilled") setJobs(jobsRes.value.data || []);
      if (appsRes.status === "fulfilled") setApplications(appsRes.value.data || []);
      if (interviewsRes.status === "fulfilled") setInterviews(interviewsRes.value.data || []);
      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data || null);
    } catch (err) {
      console.error("Error loading student dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const completionPercent = useMemo(() => {
    if (!profile) return 30;
    const fields = [
      profile.phone,
      profile.branch,
      profile.course,
      profile.passingYear,
      profile.skills,
      profile.cgpa && profile.cgpa > 0,
      profile.tenthPercentage && profile.tenthPercentage > 0,
      profile.twelfthPercentage && profile.twelfthPercentage > 0,
      profile.address,
      profile.githubUrl || profile.linkedinUrl,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.min(100, Math.max(20, Math.round((filled / fields.length) * 100)));
  }, [profile]);

  const offersCount = useMemo(
    () => applications.filter((a) => a.status === "SELECTED").length,
    [applications]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-xl shadow-indigo-500/10 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
            ✨ Your placement journey
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {user.name || "Student"} 👋
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Stay updated with opportunities, applications, and scheduled interviews.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/student/jobs")}
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
            >
              Explore Jobs →
            </button>

            <button
              onClick={() => navigate("/student/profile")}
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 right-20 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </section>

      {/* STATS */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Live metrics across your applications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="💼"
            title="Available Jobs"
            value={loading ? "..." : jobs.length}
            color="indigo"
            onClick={() => navigate("/student/jobs")}
          />

          <StatCard
            icon="📋"
            title="Applications"
            value={loading ? "..." : applications.length}
            color="violet"
            onClick={() => navigate("/student/applications")}
          />

          <StatCard
            icon="📅"
            title="Interviews"
            value={loading ? "..." : interviews.length}
            color="emerald"
            onClick={() => navigate("/student/interviews")}
          />

          <StatCard
            icon="🎯"
            title="Offers"
            value={loading ? "..." : offersCount}
            color="amber"
            onClick={() => navigate("/student/applications")}
          />
        </div>
      </section>

      {/* TWO COLUMN */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* QUICK ACTIONS */}
        <div className="xl:col-span-2">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <ActionCard
              icon="👤"
              title="Complete Profile"
              description="Add your personal, academic and professional details."
              button="Open Profile"
              onClick={() => navigate("/student/profile")}
              gradient="from-indigo-500 to-blue-500"
            />

            <ActionCard
              icon="📄"
              title="Update Resume"
              description="Keep your latest PDF resume uploaded for recruiters."
              button="Manage Resume"
              onClick={() => navigate("/student/resume")}
              gradient="from-violet-500 to-fuchsia-500"
            />

            <ActionCard
              icon="💼"
              title="Find Opportunities"
              description="Explore jobs and placement drives matching your branch."
              button="Browse Jobs"
              onClick={() => navigate("/student/jobs")}
              gradient="from-cyan-500 to-blue-500"
            />

            <ActionCard
              icon="📊"
              title="Track Applications"
              description="Monitor the real-time status of every application."
              button="View Applications"
              onClick={() => navigate("/student/applications")}
              gradient="from-emerald-500 to-teal-500"
            />
          </div>
        </div>

        {/* PROFILE COMPLETION */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Profile Progress
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Profile completion
                </p>
                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {completionPercent}%
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-lg font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                {completionPercent}%
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <p className="mt-4 text-sm leading-5 text-slate-500 dark:text-slate-400">
              Complete your profile and upload your resume to improve your chances of getting shortlisted.
            </p>

            <button
              onClick={() => navigate("/student/profile")}
              className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300 cursor-pointer"
            >
              Update Profile Details →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl dark:bg-slate-800/80">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description, button, onClick, gradient }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60 flex flex-col justify-between">
      <div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r ${gradient} text-xl text-white shadow-md`}>
          {icon}
        </div>

        <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>

      <button
        onClick={onClick}
        className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:gap-2 dark:text-indigo-400 cursor-pointer"
      >
        {button} →
      </button>
    </div>
  );
}

export default StudentDashboard;
