import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await api.get(
        "/api/student/applications"
      );

      setApplications(response.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (application) => {
    const confirm = window.confirm(
      `Are you sure you want to withdraw your application for "${application.jobTitle}" at ${application.companyName}?`
    );
    if (!confirm) return;

    try {
      setWithdrawingId(application.id);
      setError("");
      setMessage("");

      await api.put(`/api/student/applications/${application.id}/withdraw`);

      setMessage(`Your application for "${application.jobTitle}" has been withdrawn.`);
      await loadApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to withdraw application.");
    } finally {
      setWithdrawingId(null);
    }
  };

  const filtered = useMemo(() => {
    if (filter === "ALL") {
      return applications;
    }

    return applications.filter(
      (application) =>
        application.status === filter
    );
  }, [applications, filter]);

  const stats = {
    total: applications.length,
    active: applications.filter(
      (a) =>
        !["REJECTED", "WITHDRAWN", "SELECTED"].includes(
          a.status
        )
    ).length,
    shortlisted: applications.filter(
      (a) => a.status === "SHORTLISTED"
    ).length,
    selected: applications.filter(
      (a) => a.status === "SELECTED"
    ).length,
  };

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          APPLICATION TRACKER
        </p>

        <h1 className="text-3xl md:text-4xl font-bold">
          My Applications
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Track every opportunity you have applied for.
        </p>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="px-5 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <Stat
          label="Total"
          value={stats.total}
          icon="📋"
        />

        <Stat
          label="Active"
          value={stats.active}
          icon="⏳"
        />

        <Stat
          label="Shortlisted"
          value={stats.shortlisted}
          icon="⭐"
        />

        <Stat
          label="Selected"
          value={stats.selected}
          icon="🎉"
        />

      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">

        {[
          ["ALL", "All"],
          ["APPLIED", "Applied"],
          ["UNDER_REVIEW", "Under Review"],
          ["SHORTLISTED", "Shortlisted"],
          ["INTERVIEW_SCHEDULED", "Interview"],
          ["SELECTED", "Selected"],
          ["REJECTED", "Rejected"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === value
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300"
            }`}
          >
            {label}
          </button>
        ))}

      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="text-5xl mb-4">📭</div>

          <h3 className="text-xl font-bold">
            No applications found
          </h3>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Your applications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {filtered.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onWithdraw={handleWithdraw}
              withdrawing={withdrawingId === application.id}
            />
          ))}

        </div>
      )}

    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
      <div className="text-2xl mb-3">
        {icon}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="text-2xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}

function ApplicationCard({ application, onWithdraw, withdrawing }) {
  const canWithdraw = !["SELECTED", "REJECTED", "WITHDRAWN"].includes(application.status);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
            {application.companyName
              ?.charAt(0)
              ?.toUpperCase() || "C"}
          </div>

          <div>
            <h3 className="font-bold text-lg">
              {application.jobTitle}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {application.companyName}
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Applied{" "}
              {formatDate(application.appliedAt)}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">
          <StatusBadge
            status={application.status}
          />

          {canWithdraw && (
            <button
              onClick={() => onWithdraw(application)}
              disabled={withdrawing}
              className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              {withdrawing ? "Withdrawing..." : "Withdraw"}
            </button>
          )}
        </div>

      </div>

      {application.remarks && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-xs text-slate-400 dark:text-slate-500 block mb-1">
            Status Notes / Remarks:
          </span>
          {application.remarks}
        </div>
      )}

    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    APPLIED: {
      text: "Applied",
      className:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },

    UNDER_REVIEW: {
      text: "Under Review",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    },

    SHORTLISTED: {
      text: "Shortlisted",
      className:
        "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },

    INTERVIEW_SCHEDULED: {
      text: "Interview Scheduled",
      className:
        "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400",
    },

    SELECTED: {
      text: "Selected 🎉",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },

    REJECTED: {
      text: "Rejected",
      className:
        "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    },

    WITHDRAWN: {
      text: "Withdrawn",
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    },
  };

  const item =
    config[status] || {
      text: status,
      className:
        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    };

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${item.className}`}
    >
      {item.text}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "recently";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

export default StudentApplications;