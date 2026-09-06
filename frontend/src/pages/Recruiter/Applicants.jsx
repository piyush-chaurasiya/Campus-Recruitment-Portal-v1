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

function Applicants() {
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
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/recruiter/applications");
      setApplications(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load applicants."
      );
    } finally {
      setLoading(false);
    }
  };

  const jobOptions = useMemo(() => {
    const map = new Map();
    applications.forEach((a) => {
      if (!map.has(a.jobId)) {
        map.set(a.jobId, a.jobTitle);
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
        a.studentEmail?.toLowerCase().includes(text);

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
        `/api/recruiter/applications/${application.id}/status`,
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

      await loadApplicants();
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
        `/api/recruiter/applications/${application.id}/status`,
        {
          status: application.status,
          remarks: remarksDraft[application.id] ?? "",
        }
      );

      setMessage("Remarks saved.");
      await loadApplicants();
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
      const response = await api.get(`/api/recruiter/applications/${applicationId}/resume`, {
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
      setError("Unable to download applicant resume.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Applicants</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Review students who applied to your job postings.
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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid md:grid-cols-3 gap-3 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student name or email..."
          className="input"
        />

        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="input"
        >
          <option value="ALL">All Jobs</option>
          {jobOptions.map(([id, title]) => (
            <option key={id} value={id}>
              {title}
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
              className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No applicants yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Once students apply to your job postings, they'll show up
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                      {a.studentName}
                    </h3>
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

                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    {a.studentEmail}
                  </p>

                  <p className="text-slate-700 dark:text-slate-300 text-sm mt-2">
                    Applied for:{" "}
                    <span className="font-medium">{a.jobTitle}</span>
                  </p>

                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>🌿 {a.branch || "—"}</span>
                    <span>📊 CGPA: {a.cgpa ?? "—"}</span>
                    <span>⚠️ Backlogs: {a.backlogs ?? "—"}</span>
                  </div>
                </div>

                <div className="w-full md:w-64 shrink-0">
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

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">
                  Candidate Remarks / Interview Feedback (sent to student)
                </label>
                <div className="flex gap-3">
                  <textarea
                    rows={2}
                    value={remarksDraft[a.id] ?? a.remarks ?? ""}
                    onChange={(e) =>
                      setRemarksDraft((prev) => ({
                        ...prev,
                        [a.id]: e.target.value,
                      }))
                    }
                    placeholder="Add feedback, next steps, or interview notes..."
                    className="input resize-none flex-1 text-sm"
                  />
                  <button
                    onClick={() => saveRemarks(a)}
                    disabled={savingId === a.id}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50 self-start shadow-sm transition cursor-pointer"
                  >
                    Save Note
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

export default Applicants;
