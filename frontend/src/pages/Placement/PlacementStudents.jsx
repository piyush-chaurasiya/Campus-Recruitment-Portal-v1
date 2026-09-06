import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const academicStatusStyles = {
  PENDING: "bg-amber-500/10 text-amber-400",
  VERIFIED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
};

function PlacementStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/placement/students");
      setStudents(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  const branches = useMemo(() => {
    const set = new Set(
      students.map((s) => s.branch).filter(Boolean)
    );
    return Array.from(set);
  }, [students]);

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim();

    return students.filter((s) => {
      const matchesSearch =
        !text ||
        s.name?.toLowerCase().includes(text) ||
        s.email?.toLowerCase().includes(text);

      const matchesBranch =
        branchFilter === "ALL" || s.branch === branchFilter;

      const matchesStatus =
        statusFilter === "ALL" || s.academicStatus === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [students, search, branchFilter, statusFilter]);

  const handleDownloadResume = async (studentId, studentName) => {
    try {
      const response = await api.get(`/api/placement/students/${studentId}/resume`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${(studentName || "student").replaceAll(" ", "_")}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Unable to download student resume.");
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          STUDENTS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Registered Students
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Browse student academic details, eligibility status, and resumes.
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{students.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Verified</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
            {students.filter((s) => s.academicStatus === "VERIFIED" || s.academicStatus === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">Pending Verification</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
            {students.filter((s) => s.academicStatus === "PENDING").length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid md:grid-cols-3 gap-3 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email..."
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="ALL">All Academic Status</option>
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No students found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Try adjusting your search or filters.
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
                    Branch / Course
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    CGPA
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Backlogs
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    10th / 12th %
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Resume
                  </th>
                  <th className="text-left px-5 py-3 font-medium">
                    Academic Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{s.name || "—"}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{s.email}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      <p>{s.branch || "—"}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {s.course || "—"}{" "}
                        {s.passingYear ? `· ${s.passingYear}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      {s.cgpa ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      {s.backlogs ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                      {s.tenthPercentage ?? "—"} / {s.twelfthPercentage ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      {s.hasResume ? (
                        <button
                          type="button"
                          onClick={() => handleDownloadResume(s.id, s.name)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/30 transition flex items-center gap-1 cursor-pointer"
                        >
                          📄 Download
                        </button>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          academicStatusStyles[s.academicStatus] ||
                          "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {s.academicStatus || "—"}
                      </span>
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

export default PlacementStudents;
