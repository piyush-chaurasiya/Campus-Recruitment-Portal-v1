import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const statusStyles = {
  APPROVED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  REJECTED: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  CLOSED: "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700",
};

function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [closingId, setClosingId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/recruiter/jobs");
      setJobs(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load job postings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (jobId) => {
    if (!window.confirm("Are you sure you want to close this job posting?")) {
      return;
    }

    try {
      setClosingId(jobId);
      await api.put(`/api/recruiter/jobs/${jobId}/close`);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: "CLOSED" } : j
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to close job posting."
      );
    } finally {
      setClosingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manage Jobs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Manage your posted placement opportunities.
          </p>
        </div>

        <button
          onClick={() => navigate("/recruiter/jobs/create")}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          + Post New Job
        </button>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">💼</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No jobs posted yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Post your first job to start receiving applications.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {job.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {job.location || "—"} •{" "}
                    {job.jobType?.replaceAll("_", " ")}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusStyles[job.status] || statusStyles.CLOSED
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Package
                  </p>
                  <p className="font-medium mt-1 text-slate-900 dark:text-white">
                    {job.paid
                      ? job.stipendOrSalary
                        ? `₹${job.stipendOrSalary}`
                        : "Paid"
                      : "Unpaid"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Deadline
                  </p>
                  <p className="font-medium mt-1 text-slate-900 dark:text-white">
                    {job.applicationDeadline || "—"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate("/recruiter/applicants")}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer"
                >
                  View Applicants
                </button>

                {job.status !== "CLOSED" && (
                  <button
                    onClick={() => handleClose(job.id)}
                    disabled={closingId === job.id}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium disabled:opacity-50 transition cursor-pointer"
                  >
                    {closingId === job.id ? "Closing..." : "Close Job"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageJobs;
