import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const statusStyles = {
  APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  CLOSED: "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700",
};

function PlacementDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsRes, drivesRes, appsRes] = await Promise.all([
        api.get("/api/placement/students"),
        api.get("/api/placement/jobs"),
        api.get("/api/placement/applications"),
      ]);

      setStudents(studentsRes.data || []);
      setDrives(drivesRes.data || []);
      setApplications(appsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const uniqueCompanies = new Set(drives.map((d) => d.companyName?.trim()).filter(Boolean)).size;
    const activeDrives = drives.filter((d) => d.status === "APPROVED").length;
    const placedStudents = applications.filter((a) => a.status === "SELECTED").length;

    return [
      {
        title: "Registered Students",
        value: students.length,
        icon: "🎓",
        action: () => navigate("/placement/students"),
      },
      {
        title: "Partner Companies",
        value: uniqueCompanies,
        icon: "🏢",
        action: () => navigate("/placement/companies"),
      },
      {
        title: "Active Drives",
        value: activeDrives,
        icon: "📢",
        action: () => navigate("/placement/drives"),
      },
      {
        title: "Placed Students",
        value: placedStudents,
        icon: "🎯",
        action: () => navigate("/placement/placements"),
      },
    ];
  }, [students, drives, applications, navigate]);

  const applicantCounts = useMemo(() => {
    const counts = {};
    applications.forEach((a) => {
      counts[a.jobId] = (counts[a.jobId] || 0) + 1;
    });
    return counts;
  }, [applications]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome, {user.name || "Placement Officer"} 👋
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Real-time oversight of campus placements, drives, and student recruitment.
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            onClick={stat.action}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-500/50 transition cursor-pointer"
          >
            <div className="text-2xl mb-4">{stat.icon}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">
              {loading ? "..." : stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Recent Placement Drives Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Recent Placement Drives
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Active company job postings and registered candidate counts.
            </p>
          </div>

          <button
            onClick={() => navigate("/placement/drives")}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            View All Drives →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : drives.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            No placement drives created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Drive Title & Company</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold text-center">Applicants</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {drives.slice(0, 5).map((drive) => (
                  <tr key={drive.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{drive.title}</p>
                      <p className="text-xs text-slate-500">{drive.companyName}</p>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-400">{drive.location || "Remote"}</td>
                    <td className="py-3.5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {applicantCounts[drive.id] || 0}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          statusStyles[drive.status] || "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {drive.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => navigate("/placement/applications")}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Applicants →
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

export default PlacementDashboard;
