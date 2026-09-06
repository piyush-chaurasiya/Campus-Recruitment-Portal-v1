import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

function AdminJobVerification() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [selectedJob, setSelectedJob] = useState(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/jobs/admin/all"
      );

      setJobs(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  const approveJob = async (job) => {
    if (
      !window.confirm(
        `Approve "${job.title}" from ${job.companyName}?`
      )
    ) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.put(
        `/api/jobs/admin/${job.id}/approve`
      );

      setMessage(
        `${job.title} has been approved and is now available to eligible students.`
      );

      await loadJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to approve job."
      );
    }
  };

  const rejectJob = async (e) => {
    e.preventDefault();

    if (!selectedJob) return;

    if (!reason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.put(
        `/api/jobs/admin/${selectedJob.id}/reject`,
        null,
        {
          params: {
            reason: reason.trim(),
          },
        }
      );

      setMessage(
        `${selectedJob.title} has been rejected.`
      );

      setShowReject(false);
      setSelectedJob(null);
      setReason("");

      await loadJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Unable to reject job."
      );
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {

      const text = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !text ||
        job.title
          ?.toLowerCase()
          .includes(text) ||
        job.companyName
          ?.toLowerCase()
          .includes(text);

      const matchesStatus =
        status === "ALL" ||
        job.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [jobs, search, status]);

  const pending = jobs.filter(
    (job) => job.status === "PENDING"
  ).length;

  const approved = jobs.filter(
    (job) => job.status === "APPROVED"
  ).length;

  const rejected = jobs.filter(
    (job) => job.status === "REJECTED"
  ).length;

  return (
    <div className="space-y-7">

      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          PLACEMENT CONTROL
        </p>

        <h1 className="text-3xl md:text-4xl font-bold">
          Job Verification
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Review placement opportunities before publishing them to students.
        </p>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="px-5 py-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Stat
          icon="⏳"
          title="Pending"
          value={pending}
        />

        <Stat
          icon="✅"
          title="Approved"
          value={approved}
        />

        <Stat
          icon="❌"
          title="Rejected"
          value={rejected}
        />

      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">

        <div className="grid md:grid-cols-2 gap-3">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search job title or company..."
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500"
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="ALL">
              All Status
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>
          </select>

        </div>

      </div>

      {/* JOB LIST */}
      {loading ? (
        <div className="space-y-4">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}

        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">

          <div className="text-5xl mb-4">
            💼
          </div>

          <h3 className="text-xl font-bold">
            No jobs found
          </h3>

          <p className="text-slate-500 mt-2">
            There are no jobs matching the current filters.
          </p>

        </div>
      ) : (
        <div className="space-y-5">

          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApprove={approveJob}
              onReject={(job) => {
                setSelectedJob(job);
                setReason("");
                setError("");
                setShowReject(true);
              }}
            />
          ))}

        </div>
      )}

      {/* REJECT MODAL */}
      {showReject && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6">

            <h2 className="text-xl font-bold">
              Reject Job
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Rejecting{" "}
              <b>{selectedJob.title}</b>
            </p>

            <form
              onSubmit={rejectJob}
              className="mt-6 space-y-4"
            >

              <textarea
                rows="5"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder="Enter rejection reason..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none"
              />

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowReject(false)
                  }
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Reject Job
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

function JobCard({
  job,
  onApprove,
  onReject,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition">

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

        <div className="flex gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl">
            💼
          </div>

          <div>

            <h2 className="text-xl font-bold">
              {job.title}
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {job.companyName}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">

              <Tag text={job.jobType} />

              <Tag text={job.workMode} />

              <Tag
                text={
                  job.paid
                    ? "Paid"
                    : "Unpaid"
                }
              />

              <StatusTag
                status={job.status}
              />

            </div>

          </div>

        </div>

        {job.status === "PENDING" && (
          <div className="flex gap-2">

            <button
              onClick={() => onReject(job)}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
            >
              Reject
            </button>

            <button
              onClick={() => onApprove(job)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              ✓ Approve
            </button>

          </div>
        )}

      </div>

      <p className="text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">
        {job.description || "No description provided."}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">

        <Info
          label="Location"
          value={job.location || "—"}
        />

        <Info
          label="Minimum CGPA"
          value={job.minimumCgpa ?? "—"}
        />

        <Info
          label="Max Backlogs"
          value={job.maximumBacklogs ?? "—"}
        />

        <Info
          label="Deadline"
          value={job.applicationDeadline || "—"}
        />

      </div>

      <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-5 text-sm text-slate-500">

        <span>
          🌿 Branches:{" "}
          {job.eligibleBranches || "All"}
        </span>

        <span>
          📍 {job.location || "Remote"}
        </span>

        {job.stipendOrSalary && (
          <span>
            💰 {job.stipendOrSalary}
          </span>
        )}

      </div>

    </div>
  );
}

function Tag({ text }) {
  return (
    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
      {text || "—"}
    </span>
  );
}

function StatusTag({ status }) {
  const styles = {
    PENDING:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",

    APPROVED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",

    REJECTED:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="font-semibold mt-1">
        {value}
      </p>

    </div>
  );
}

function Stat({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">

      <div className="text-2xl">
        {icon}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
        {title}
      </p>

      <p className="text-2xl font-bold mt-1">
        {value}
      </p>

    </div>
  );
}

export default AdminJobVerification;