import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function PlacementReports() {
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
      setError(
        err.response?.data?.message || "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  const selected = useMemo(
    () => applications.filter((a) => a.status === "SELECTED"),
    [applications]
  );

  const placedStudentIds = useMemo(
    () => new Set(selected.map((a) => a.studentId)),
    [selected]
  );

  const overview = useMemo(() => {
    const totalStudents = students.length;
    const totalPlaced = placedStudentIds.size;
    const placementRate = totalStudents
      ? Math.round((totalPlaced / totalStudents) * 100)
      : 0;

    return {
      totalStudents,
      totalPlaced,
      placementRate,
      totalDrives: drives.length,
      approvedDrives: drives.filter((d) => d.status === "APPROVED").length,
      pendingDrives: drives.filter((d) => d.status === "PENDING").length,
      totalApplications: applications.length,
      totalCompanies: new Set(drives.map((d) => d.companyName)).size,
    };
  }, [students, drives, applications, placedStudentIds]);

  const branchBreakdown = useMemo(() => {
    const map = new Map();

    students.forEach((s) => {
      const branch = s.branch || "Unspecified";
      if (!map.has(branch)) {
        map.set(branch, { branch, total: 0, placed: 0 });
      }
      map.get(branch).total += 1;
      if (placedStudentIds.has(s.id)) {
        map.get(branch).placed += 1;
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.total - a.total
    );
  }, [students, placedStudentIds]);

  const statusBreakdown = useMemo(() => {
    const statuses = [
      "APPLIED",
      "UNDER_REVIEW",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "SELECTED",
      "REJECTED",
      "WITHDRAWN",
    ];

    return statuses.map((s) => ({
      status: s,
      count: applications.filter((a) => a.status === s).length,
    }));
  }, [applications]);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          REPORTS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Placement Reports
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Overall placement performance across students, drives, and
          companies.
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {/* OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {overview.totalStudents}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">Students Placed</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {overview.totalPlaced}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">Placement Rate</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {overview.placementRate}%
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">Companies Onboarded</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {overview.totalCompanies}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Drives</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {overview.totalDrives}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">Approved Drives</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {overview.approvedDrives}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending Approval</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                {overview.pendingDrives}
              </p>
            </div>
          </div>

          {/* BRANCH-WISE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
              Branch-wise Placement
            </h3>

            {branchBreakdown.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">No student data yet.</p>
            ) : (
              <div className="space-y-4">
                {branchBreakdown.map((b) => {
                  const pct = b.total
                    ? Math.round((b.placed / b.total) * 100)
                    : 0;

                  return (
                    <div key={b.branch}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {b.branch}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {b.placed} / {b.total} placed ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* APPLICATION STATUS BREAKDOWN */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
              Application Status Breakdown
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {statusBreakdown.map((s) => (
                <div
                  key={s.status}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 rounded-xl p-3 text-center"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {s.status.replaceAll("_", " ")}
                  </p>
                  <p className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{s.count}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PlacementReports;
