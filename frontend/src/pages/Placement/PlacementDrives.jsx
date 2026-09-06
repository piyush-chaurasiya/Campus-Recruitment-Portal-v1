import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  title: "",
  companyName: "",
  description: "",
  location: "",
  jobType: "FULL_TIME",
  workMode: "ON_SITE",
  paid: true,
  stipendOrSalary: "",
  minimumCgpa: "",
  maximumBacklogs: "",
  minimumTenthPercentage: "",
  minimumTwelfthPercentage: "",
  eligibleBranches: "",
  applicationDeadline: "",
  joiningDate: "",
};

function PlacementDrives() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

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

      const response = await api.get("/api/placement/jobs");

      setJobs(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load placement drives."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const createDrive = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.companyName.trim()) {
      setError("Title and company name are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        stipendOrSalary: form.stipendOrSalary
          ? Number(form.stipendOrSalary)
          : null,
        minimumCgpa: form.minimumCgpa
          ? Number(form.minimumCgpa)
          : null,
        maximumBacklogs: form.maximumBacklogs
          ? Number(form.maximumBacklogs)
          : null,
        minimumTenthPercentage: form.minimumTenthPercentage
          ? Number(form.minimumTenthPercentage)
          : null,
        minimumTwelfthPercentage: form.minimumTwelfthPercentage
          ? Number(form.minimumTwelfthPercentage)
          : null,
        applicationDeadline: form.applicationDeadline || null,
        joiningDate: form.joiningDate || null,
      };

      await api.post("/api/placement/jobs", payload);

      setMessage(
        `"${form.title}" has been submitted for approval.`
      );

      setForm(emptyForm);
      setShowCreate(false);

      await loadJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create placement drive."
      );
    } finally {
      setSubmitting(false);
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

      await api.put(`/api/placement/jobs/${job.id}/approve`);

      setMessage(
        `${job.title} has been approved and is now visible to eligible students.`
      );

      await loadJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to approve drive."
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
        `/api/placement/jobs/${selectedJob.id}/reject`,
        null,
        { params: { reason: reason.trim() } }
      );

      setMessage(`${selectedJob.title} has been rejected.`);

      setShowReject(false);
      setSelectedJob(null);
      setReason("");

      await loadJobs();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reject drive."
      );
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = search.toLowerCase().trim();

      const matchesSearch =
        !text ||
        job.title?.toLowerCase().includes(text) ||
        job.companyName?.toLowerCase().includes(text);

      const matchesStatus =
        status === "ALL" || job.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);

  const pending = jobs.filter((j) => j.status === "PENDING").length;
  const approved = jobs.filter((j) => j.status === "APPROVED").length;
  const rejected = jobs.filter((j) => j.status === "REJECTED").length;

  return (
    <div className="space-y-7">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
            PLACEMENT DRIVES
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Manage Drives
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Post new placement drives and track their approval status.
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setError("");
            setShowCreate(true);
          }}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold self-start shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          + Post New Drive
        </button>
      </div>

      {/* MESSAGES */}
      {message && (
        <div className="px-5 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat icon="⏳" title="Pending" value={pending} />
        <Stat icon="✅" title="Approved" value={approved} />
        <Stat icon="❌" title="Rejected" value={rejected} />
      </div>

      {/* FILTERS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search drive title or company..."
            className="input"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* JOB LIST */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-56 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">📢</div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No placement drives found
          </h3>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Post a new drive to get started.
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

      {/* CREATE DRIVE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 my-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Post New Drive</h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              This drive will need approval before students can see it.
            </p>

            <form onSubmit={createDrive} className="mt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Job Title *">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      updateField("title", e.target.value)
                    }
                    className="input"
                  />
                </Field>

                <Field label="Company Name *">
                  <input
                    value={form.companyName}
                    onChange={(e) =>
                      updateField("companyName", e.target.value)
                    }
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  className="input resize-none"
                />
              </Field>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Location">
                  <input
                    value={form.location}
                    onChange={(e) =>
                      updateField("location", e.target.value)
                    }
                    className="input"
                  />
                </Field>

                <Field label="Eligible Branches">
                  <input
                    value={form.eligibleBranches}
                    onChange={(e) =>
                      updateField(
                        "eligibleBranches",
                        e.target.value
                      )
                    }
                    placeholder="e.g. CSE, IT, ECE"
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Job Type">
                  <select
                    value={form.jobType}
                    onChange={(e) =>
                      updateField("jobType", e.target.value)
                    }
                    className="input"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                </Field>

                <Field label="Work Mode">
                  <select
                    value={form.workMode}
                    onChange={(e) =>
                      updateField("workMode", e.target.value)
                    }
                    className="input"
                  >
                    <option value="ON_SITE">On Site</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </Field>

                <Field label="Stipend / Salary">
                  <input
                    type="number"
                    value={form.stipendOrSalary}
                    onChange={(e) =>
                      updateField(
                        "stipendOrSalary",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Minimum CGPA">
                  <input
                    type="number"
                    step="0.01"
                    value={form.minimumCgpa}
                    onChange={(e) =>
                      updateField("minimumCgpa", e.target.value)
                    }
                    className="input"
                  />
                </Field>

                <Field label="Max Backlogs">
                  <input
                    type="number"
                    value={form.maximumBacklogs}
                    onChange={(e) =>
                      updateField(
                        "maximumBacklogs",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </Field>

                <Field label="Paid?">
                  <select
                    value={form.paid ? "yes" : "no"}
                    onChange={(e) =>
                      updateField(
                        "paid",
                        e.target.value === "yes"
                      )
                    }
                    className="input"
                  >
                    <option value="yes">Paid</option>
                    <option value="no">Unpaid</option>
                  </select>
                </Field>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Application Deadline">
                  <input
                    type="date"
                    value={form.applicationDeadline}
                    onChange={(e) =>
                      updateField(
                        "applicationDeadline",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </Field>

                <Field label="Joining Date">
                  <input
                    type="date"
                    value={form.joiningDate}
                    onChange={(e) =>
                      updateField("joiningDate", e.target.value)
                    }
                    className="input"
                  />
                </Field>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60 shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  {submitting ? "Posting..." : "Post Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {showReject && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Reject Drive</h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Rejecting <b>{selectedJob.title}</b>
            </p>

            <form onSubmit={rejectJob} className="mt-6 space-y-4">
              <textarea
                rows="5"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="input resize-none"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReject(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition cursor-pointer"
                >
                  Reject Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function JobCard({ job, onApprove, onReject }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shadow-blue-500/20">
            📢
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{job.title}</h2>

            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {job.companyName}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Tag text={job.jobType} />
              <Tag text={job.workMode} />
              <Tag text={job.paid ? "Paid" : "Unpaid"} />
              <StatusTag status={job.status} />
            </div>
          </div>
        </div>

        {job.status === "PENDING" && (
          <div className="flex gap-2">
            <button
              onClick={() => onReject(job)}
              className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold transition cursor-pointer"
            >
              Reject
            </button>

            <button
              onClick={() => onApprove(job)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition cursor-pointer"
            >
              ✓ Approve
            </button>
          </div>
        )}
      </div>

      <p className="text-slate-700 dark:text-slate-300 mt-5 leading-relaxed">
        {job.description || "No description provided."}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <Info label="Location" value={job.location || "—"} />
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

      <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-5 text-sm text-slate-500 dark:text-slate-400">
        <span>🌿 Branches: {job.eligibleBranches || "All"}</span>
        <span>📍 {job.location || "Remote"}</span>
        {job.stipendOrSalary && (
          <span>💰 {job.stipendOrSalary}</span>
        )}
      </div>
    </div>
  );
}

function Tag({ text }) {
  return (
    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
      {text || "—"}
    </span>
  );
}

function StatusTag({ status }) {
  const styles = {
    PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    CLOSED: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
        styles[status] || styles.CLOSED
      }`}
    >
      {status}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
      <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
      <p className="font-semibold mt-1 text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function Stat({ icon, title, value }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{title}</p>
      <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export default PlacementDrives;
