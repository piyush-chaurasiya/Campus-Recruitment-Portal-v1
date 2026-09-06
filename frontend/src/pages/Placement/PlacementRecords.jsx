import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function PlacementRecords() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/placement/applications");
      setApplications(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load placement records."
      );
    } finally {
      setLoading(false);
    }
  };

  const placed = useMemo(
    () => applications.filter((a) => a.status === "SELECTED"),
    [applications]
  );

  const branches = useMemo(() => {
    const set = new Set(placed.map((p) => p.branch).filter(Boolean));
    return Array.from(set);
  }, [placed]);

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim();

    return placed.filter((p) => {
      const matchesSearch =
        !text ||
        p.studentName?.toLowerCase().includes(text) ||
        p.companyName?.toLowerCase().includes(text) ||
        p.jobTitle?.toLowerCase().includes(text);

      const matchesBranch =
        branchFilter === "ALL" || p.branch === branchFilter;

      return matchesSearch && matchesBranch;
    });
  }, [placed, search, branchFilter]);

  const stats = useMemo(() => {
    const uniqueStudents = new Set(placed.map((p) => p.studentId)).size;
    const uniqueCompanies = new Set(placed.map((p) => p.companyName)).size;

    return {
      totalPlaced: uniqueStudents,
      totalCompanies: uniqueCompanies,
    };
  }, [placed]);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          PLACEMENTS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Final Placement Records
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Students who have been marked "Selected" across all drives.
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Students Placed</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.totalPlaced}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Companies Involved</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{stats.totalCompanies}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Offers</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{placed.length}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid md:grid-cols-2 gap-3 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student, company, or role..."
          className="input"
        />

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="input"
        >
          <option value="ALL">All Branches</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No placements yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Once you mark applications as "Selected" in the Applications
            page, they'll show up here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">
                    Student
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Branch
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Company
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Role
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Selected On
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{p.studentName}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {p.studentEmail}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      {p.branch || "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      {p.companyName}
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      {p.jobTitle}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {p.updatedAt
                        ? new Date(p.updatedAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlacementRecords;
