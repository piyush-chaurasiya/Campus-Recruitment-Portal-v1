import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

function StudentJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  const isDeadlinePassed = useMemo(() => {
    if (!job?.applicationDeadline) return false;
    const deadline = new Date(job.applicationDeadline);
    deadline.setHours(23, 59, 59, 999);
    return deadline.getTime() < Date.now();
  }, [job?.applicationDeadline]);

  useEffect(() => {
    loadJob();
    checkApplication();
  }, [id]);

  const loadJob = async () => {
    try {
      const response = await api.get(
        `/api/student/jobs/${id}`
      );

      setJob(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to load this opportunity."
      );
    } finally {
      setLoading(false);
    }
  };

  const checkApplication = async () => {
    try {
      const response = await api.get(
        "/api/student/applications"
      );

      const exists = (response.data || []).some(
        (application) =>
          String(application.jobId) === String(id)
      );

      setApplied(exists);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      setMessage("");

      await api.post(
        `/api/student/applications/jobs/${id}`
      );

      setApplied(true);
      setMessage(
        "Application submitted successfully!"
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to submit application."
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-10 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold">
          Opportunity not found
        </h2>
        <button
          onClick={() => navigate("/student/jobs")}
          className="mt-5 px-5 py-3 rounded-xl bg-blue-600 text-white"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* BACK */}
      <button
        onClick={() => navigate("/student/jobs")}
        className="text-sm font-medium text-slate-500 hover:text-blue-600"
      >
        ← Back to Jobs
      </button>

      {/* HERO */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-7 md:p-10 text-white">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

          <div className="flex gap-5">

            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-2xl font-bold">
              {job.companyName?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div>
              <p className="text-blue-100 text-sm">
                {job.companyName}
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-1">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1.5 rounded-full bg-white/15 text-sm">
                  {format(job.jobType)}
                </span>

                <span className="px-3 py-1.5 rounded-full bg-white/15 text-sm">
                  {format(job.workMode)}
                </span>

                {job.location && (
                  <span className="px-3 py-1.5 rounded-full bg-white/15 text-sm">
                    📍 {job.location}
                  </span>
                )}
              </div>
            </div>

          </div>

          {applied ? (
            <span className="self-start px-4 py-2 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 font-semibold">
              ✓ Applied
            </span>
          ) : isDeadlinePassed ? (
            <span className="self-start px-4 py-2 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-100 font-semibold">
              ⏱ Deadline Passed
            </span>
          ) : job.eligible ? (
            <span className="self-start px-4 py-2 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-100 font-semibold">
              ✓ You are Eligible
            </span>
          ) : (
            <span className="self-start px-4 py-2 rounded-full bg-red-400/20 border border-red-300/30 text-red-100 font-semibold">
              ✕ Not Eligible
            </span>
          )}

        </div>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="px-5 py-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300">
          {message}
        </div>
      )}

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* MAIN */}
        <div className="lg:col-span-2 space-y-6">

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold">
              About the Opportunity
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-7 whitespace-pre-line">
              {job.description ||
                "No description provided."}
            </p>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-5">
              Eligibility Requirements
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">

              <Requirement
                label="Minimum CGPA"
                value={
                  job.minimumCgpa ??
                  "Not specified"
                }
              />

              <Requirement
                label="Maximum Backlogs"
                value={
                  job.maximumBacklogs ??
                  "Not specified"
                }
              />

              <Requirement
                label="Minimum 10th"
                value={
                  job.minimumTenthPercentage != null
                    ? `${job.minimumTenthPercentage}%`
                    : "Not specified"
                }
              />

              <Requirement
                label="Minimum 12th"
                value={
                  job.minimumTwelfthPercentage != null
                    ? `${job.minimumTwelfthPercentage}%`
                    : "Not specified"
                }
              />

              <Requirement
                label="Eligible Branches"
                value={
                  job.eligibleBranches ||
                  "All branches"
                }
              />

            </div>

            <div
              className={`mt-5 p-4 rounded-xl ${
                job.eligible
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              <strong>
                {job.eligible
                  ? "You can apply"
                  : "You cannot apply"}
              </strong>

              <p className="mt-1 text-sm">
                {job.eligibilityReason}
              </p>
            </div>

          </section>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-5">

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">

            <h2 className="font-bold text-lg">
              Opportunity Details
            </h2>

            <div className="space-y-4 mt-5">

              <Detail
                label="Type"
                value={format(job.jobType)}
              />

              <Detail
                label="Work Mode"
                value={format(job.workMode)}
              />

              <Detail
                label="Location"
                value={job.location || "Not specified"}
              />

              <Detail
                label="Compensation"
                value={
                  job.paid
                    ? job.stipendOrSalary
                      ? `₹${job.stipendOrSalary}`
                      : "Paid"
                    : "Unpaid"
                }
              />

              <Detail
                label="Deadline"
                value={
                  job.applicationDeadline ||
                  "Not specified"
                }
              />

              <Detail
                label="Joining Date"
                value={
                  job.joiningDate ||
                  "Not specified"
                }
              />

            </div>

            <button
              onClick={handleApply}
              disabled={
                !job.eligible ||
                applied ||
                applying ||
                isDeadlinePassed
              }
              className={`w-full mt-7 py-3.5 rounded-xl font-semibold transition ${
                applied
                  ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : isDeadlinePassed
                  ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 cursor-not-allowed border border-amber-200 dark:border-amber-500/20"
                  : !job.eligible
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer"
              }`}
            >
              {applied
                ? "✓ Application Submitted"
                : applying
                ? "Submitting..."
                : isDeadlinePassed
                ? "Deadline Passed"
                : !job.eligible
                ? "Not Eligible"
                : "Apply Now"}
            </button>

          </section>

          <section className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5">

            <p className="font-semibold text-blue-700 dark:text-blue-400">
              💡 Application Tip
            </p>

            <p className="text-sm text-blue-600 dark:text-blue-300 mt-2 leading-6">
              Make sure your profile and resume are
              updated before applying.
            </p>

          </section>

        </aside>

      </div>
    </div>
  );
}

function Requirement({ label, value }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-right">
        {value}
      </span>
    </div>
  );
}

function format(value) {
  if (!value) return "Not specified";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

export default StudentJobDetails;