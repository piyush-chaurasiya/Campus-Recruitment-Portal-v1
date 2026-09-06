import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const statusBadgeStyles = {
  APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  CLOSED: "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700",
};

function RecruiterDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [jobsRes, appsRes] = await Promise.all([
        api.get("/api/recruiter/jobs"),
        api.get("/api/recruiter/applications"),
      ]);

      setJobs(jobsRes.data || []);
      setApplications(appsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Compute live applicant counts per job
  const { applicantCounts, shortlistedCounts } = useMemo(() => {
    const appCounts = {};
    const slCounts = {};

    applications.forEach((a) => {
      appCounts[a.jobId] = (appCounts[a.jobId] || 0) + 1;
      if (
        a.status === "SHORTLISTED" ||
        a.status === "INTERVIEW_SCHEDULED" ||
        a.status === "SELECTED"
      ) {
        slCounts[a.jobId] = (slCounts[a.jobId] || 0) + 1;
      }
    });

    return { applicantCounts: appCounts, shortlistedCounts: slCounts };
  }, [applications]);

  // Compute live overview statistics
  const stats = useMemo(() => {
    const activeJobs = jobs.filter((j) => j.status === "APPROVED").length;
    const totalApps = applications.length;
    const shortlisted = applications.filter(
      (a) => a.status === "SHORTLISTED" || a.status === "INTERVIEW_SCHEDULED"
    ).length;
    const selected = applications.filter((a) => a.status === "SELECTED").length;

    return [
      {
        title: "Active Jobs",
        value: activeJobs,
        icon: "💼",
        detail: `${jobs.length} total posted`,
        action: () => navigate("/recruiter/jobs"),
      },
      {
        title: "Applications",
        value: totalApps,
        icon: "📋",
        detail: "From interested students",
        action: () => navigate("/recruiter/applicants"),
      },
      {
        title: "Shortlisted",
        value: shortlisted,
        icon: "⭐",
        detail: "In interview process",
        action: () => navigate("/recruiter/applicants"),
      },
      {
        title: "Selected Hires",
        value: selected,
        icon: "🎯",
        detail: "Offers extended",
        action: () => navigate("/recruiter/applicants"),
      },
    ];
  }, [jobs, applications, navigate]);

  return (
    <div className="space-y-8">
      {/* Header with quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome, {user.name || "Recruiter"} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Real-time overview of your recruitment campaigns and applicant pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/recruiter/jobs/create")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            + Post New Job
          </button>
        </div>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          ⚠️ {error}
        </div>
      )}

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            onClick={stat.action}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-500/50 transition cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
                  {loading ? "..." : stat.value}
                </h3>
              </div>
              <div className="text-2xl p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Real Recruitment Overview (Jobs Table) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your Job Postings & Candidates
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live status and applicant funnel for each of your openings.
            </p>
          </div>

          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline self-start sm:self-auto cursor-pointer"
          >
            Manage All Jobs →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <div className="text-5xl mb-3">💼</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No job postings created yet
            </h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Create your first job posting to start receiving student applications.
            </p>
            <button
              onClick={() => navigate("/recruiter/jobs/create")}
              className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition cursor-pointer"
            >
              + Post a Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-4 font-semibold">Job Title</th>
                  <th className="pb-4 font-semibold">Location</th>
                  <th className="pb-4 font-semibold text-center">Applicants</th>
                  <th className="pb-4 font-semibold text-center">Shortlisted</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {job.jobType || "Full Time"} · {job.workMode || "On-site"}
                      </p>
                    </td>

                    <td className="py-4 text-slate-600 dark:text-slate-400">
                      {job.location || "Remote"}
                    </td>

                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {applicantCounts[job.id] || 0}
                      </span>
                    </td>

                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {shortlistedCounts[job.id] || 0}
                      </span>
                    </td>

                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusBadgeStyles[job.status] ||
                          "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {job.status === "APPROVED"
                          ? "Active"
                          : job.status === "PENDING"
                          ? "Pending Approval"
                          : job.status || "Draft"}
                      </span>
                    </td>

                    <td className="py-4 text-right">
                      <button
                        onClick={() => navigate("/recruiter/applicants")}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition cursor-pointer"
                      >
                        View Applicants →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
