import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const STATUS_OPTIONS = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "SELECTED",
  "REJECTED",
  "WITHDRAWN",
];

const statusStyles = {
  APPLIED: "bg-slate-500/10 text-slate-300",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-400",
  SHORTLISTED: "bg-amber-500/10 text-amber-400",
  INTERVIEW_SCHEDULED: "bg-purple-500/10 text-purple-400",
  SELECTED: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
  WITHDRAWN: "bg-slate-500/10 text-slate-500",
};

function PlacementApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [jobFilter, setJobFilter] = useState("ALL");

  const [savingId, setSavingId] = useState(null);
  const [remarksDraft, setRemarksDraft] = useState({});

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
        err.response?.data?.message ||
          "Unable to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const jobOptions = useMemo(() => {
    const map = new Map();
    applications.forEach((a) => {
      if (!map.has(a.jobId)) {
        map.set(a.jobId, `${a.jobTitle} — ${a.companyName}`);
      }
    });
    return Array.from(map.entries());
  }, [applications]);

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim();

    return applications.filter((a) => {
      const matchesSearch =
        !text ||
        a.studentName?.toLowerCase().includes(text) ||
        a.studentEmail?.toLowerCase().includes(text) ||
        a.jobTitle?.toLowerCase().includes(text) ||
        a.companyName?.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "ALL" || a.status === statusFilter;

      const matchesJob =
        jobFilter === "ALL" || String(a.jobId) === String(jobFilter);

      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [applications, search, statusFilter, jobFilter]);

  const handleStatusChange = async (application, newStatus) => {
    setSavingId(application.id);
    setError("");
    setMessage("");

    try {
      await api.put(
        `/api/placement/applications/${application.id}/status`,
        {
          status: newStatus,
          remarks: remarksDraft[application.id] ?? application.remarks ?? "",
        }
      );

      setMessage(
        `${application.studentName}'s application updated to ${newStatus.replaceAll(
          "_",
          " "
        )}.`
      );

      await loadApplications();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update application status."
      );
    } finally {
      setSavingId(null);
    }
  };

  const saveRemarks = async (application) => {
    setSavingId(application.id);
    setError("");
    setMessage("");

    try {
      await api.put(
        `/api/placement/applications/${application.id}/status`,
        {
          status: application.status,
          remarks: remarksDraft[application.id] ?? "",
        }
      );

      setMessage("Remarks saved.");
      await loadApplications();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save remarks."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDownloadResume = async (applicationId, studentName) => {
    try {
      const response = await api.get(`/api/placement/applications/${applicationId}/resume`, {
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

  const counts = useMemo(() => {
    const base = Object.fromEntries(STATUS_OPTIONS.map((s) => [s, 0]));
    applications.forEach((a) => {
      base[a.status] = (base[a.status] || 0) + 1;
    });
    return base;
  }, [applications]);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          APPLICATIONS
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Student Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Review applicants across all placement drives and update their
          status.
        </p>
      </div>

      {message && (
        <div className="px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {STATUS_OPTIONS.map((s) => (
          <div
            key={s}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center shadow-sm"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {s.replaceAll("_", " ")}
            </p>
            <p className="text-xl font-bold mt-1 text-slate-900 dark:text-white">{counts[s]}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid md:grid-cols-3 gap-3 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student, email, job, or company..."
          className="input"
        />

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="input"
        >
          <option value="ALL">All Drives</option>
          {jobOptions.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="ALL">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No applications found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Try adjusting your filters, or check back once students start
            applying.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {a.studentName || "Unknown Student"}
                    </h2>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        statusStyles[a.status] || statusStyles.APPLIED
                      }`}
                    >
                      {a.status?.replaceAll("_", " ")}
                    </span>

                    {a.hasResume ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadResume(a.id, a.studentName)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/30 transition flex items-center gap-1 cursor-pointer"
                      >
                        📄 Download Resume
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        No resume
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                    {a.studentEmail}
                  </p>

                  <p className="text-slate-700 dark:text-slate-300 mt-3 font-medium">
                    Applied for: {a.jobTitle} — {a.companyName}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>🌿 Branch: {a.branch || "—"}</span>
                    <span>📊 CGPA: {a.cgpa ?? "—"}</span>
                    <span>⚠️ Backlogs: {a.backlogs ?? "—"}</span>
                    <span>
                      📅 Applied:{" "}
                      {a.appliedAt
                        ? new Date(a.appliedAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-72 shrink-0">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                    Update Status
                  </label>
                  <select
                    value={a.status}
                    disabled={savingId === a.id}
                    onChange={(e) =>
                      handleStatusChange(a, e.target.value)
                    }
                    className="input disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                  Remarks
                </label>
                <div className="flex gap-3">
                  <textarea
                    rows={2}
                    value={
                      remarksDraft[a.id] ?? a.remarks ?? ""
                    }
                    onChange={(e) =>
                      setRemarksDraft((prev) => ({
                        ...prev,
                        [a.id]: e.target.value,
                      }))
                    }
                    placeholder="Add a note visible internally..."
                    className="input resize-none flex-1"
                  />
                  <button
                    onClick={() => saveRemarks(a)}
                    disabled={savingId === a.id}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 self-start shadow-sm transition cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlacementApplications;
