import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function StudentJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("ALL");
  const [workMode, setWorkMode] = useState("ALL");
  const [paid, setPaid] = useState("ALL");
  const [eligibility, setEligibility] = useState("ALL");
  const [location, setLocation] = useState("ALL");

  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/student/jobs");

      setJobs(response.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to load available opportunities."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await api.get(
        "/api/student/applications"
      );

      const ids = new Set(
        (response.data || []).map(
          (application) => application.jobId
        )
      );

      setAppliedIds(ids);
    } catch (err) {
      console.error("Application loading error:", err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId);
      setMessage("");

      await api.post(
        `/api/student/applications/jobs/${jobId}`
      );

      setAppliedIds((previous) => {
        const updated = new Set(previous);
        updated.add(jobId);
        return updated;
      });

      setMessage(
        "Application submitted successfully!"
      );
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Unable to submit application."
      );
    } finally {
      setApplyingId(null);
    }
  };

  const locations = useMemo(() => {
    return [
      "ALL",
      ...new Set(
        jobs
          .map((job) => job.location)
          .filter(Boolean)
      ),
    ];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText =
        `${job.title} ${job.companyName} ${job.description || ""}`
          .toLowerCase();

      const matchesSearch =
        searchText.includes(search.toLowerCase());

      const matchesType =
        jobType === "ALL" ||
        job.jobType === jobType;

      const matchesMode =
        workMode === "ALL" ||
        job.workMode === workMode;

      const matchesPaid =
        paid === "ALL" ||
        (paid === "PAID" && job.paid === true) ||
        (paid === "UNPAID" && job.paid === false);

      const matchesEligibility =
        eligibility === "ALL" ||
        (eligibility === "ELIGIBLE" &&
          job.eligible === true) ||
        (eligibility === "NOT_ELIGIBLE" &&
          job.eligible === false);

      const matchesLocation =
        location === "ALL" ||
        job.location === location;

      return (
        matchesSearch &&
        matchesType &&
        matchesMode &&
        matchesPaid &&
        matchesEligibility &&
        matchesLocation
      );
    });
  }, [
    jobs,
    search,
    jobType,
    workMode,
    paid,
    eligibility,
    location,
  ]);

  const resetFilters = () => {
    setSearch("");
    setJobType("ALL");
    setWorkMode("ALL");
    setPaid("ALL");
    setEligibility("ALL");
    setLocation("ALL");
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
              CAREER OPPORTUNITIES
            </p>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Browse Jobs & Internships
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Discover verified opportunities matched with
              your profile.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">
                Available
              </p>

              <p className="text-lg font-bold">
                {jobs.length}
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Eligible
              </p>

              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {
                  jobs.filter(
                    (job) => job.eligible
                  ).length
                }
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">

        <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
            🔎
          </span>

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search by job title, company or skills..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />

        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">

          <Filter
            label="Job Type"
            value={jobType}
            onChange={setJobType}
            options={[
              ["ALL", "All Types"],
              ["FULL_TIME", "Full Time"],
              ["PART_TIME", "Part Time"],
              ["INTERNSHIP", "Internship"],
            ]}
          />

          <Filter
            label="Work Mode"
            value={workMode}
            onChange={setWorkMode}
            options={[
              ["ALL", "All Modes"],
              ["REMOTE", "Remote"],
              ["ON_SITE", "On-site"],
              ["HYBRID", "Hybrid"],
            ]}
          />

          <Filter
            label="Compensation"
            value={paid}
            onChange={setPaid}
            options={[
              ["ALL", "Paid & Unpaid"],
              ["PAID", "Paid"],
              ["UNPAID", "Unpaid"],
            ]}
          />

          <Filter
            label="Eligibility"
            value={eligibility}
            onChange={setEligibility}
            options={[
              ["ALL", "Everyone"],
              ["ELIGIBLE", "Eligible"],
              ["NOT_ELIGIBLE", "Not Eligible"],
            ]}
          />

          <Filter
            label="Location"
            value={location}
            onChange={setLocation}
            options={locations.map((item) => [
              item,
              item === "ALL"
                ? "All Locations"
                : item,
            ])}
          />

        </div>

        <button
          onClick={resetFilters}
          className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Reset all filters
        </button>

      </div>

      {/* RESULT COUNT */}
      <div className="flex items-center justify-between">

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {filteredJobs.length}
          </span>{" "}
          opportunities
        </p>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-5">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}

        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        filteredJobs.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h3 className="text-xl font-semibold">
              No opportunities found
            </h3>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>

          </div>
        )}

      {/* JOB CARDS */}
      {!loading &&
        filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {filteredJobs.map((job) => {

              const alreadyApplied =
                appliedIds.has(job.id);

              return (
                <JobCard
                  key={job.id}
                  job={job}
                  alreadyApplied={alreadyApplied}
                  applying={
                    applyingId === job.id
                  }
                  onApply={handleApply}
                  onView={() =>
                    navigate(
                      `/student/jobs/${job.id}`
                    )
                  }
                />
              );
            })}

          </div>
        )}

    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        {options.map(([value, label]) => (
          <option
            key={value}
            value={value}
          >
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function JobCard({
  job,
  alreadyApplied,
  applying,
  onApply,
  onView,
}) {
  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/40 transition-all duration-300">

      {/* TOP */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
            {job.companyName?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div>
            <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {job.title}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {job.companyName}
            </p>
          </div>

        </div>

        {job.eligible ? (
          <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            ✓ Eligible
          </span>
        ) : (
          <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400">
            ✕ Not Eligible
          </span>
        )}

      </div>

      {/* DESCRIPTION */}
      <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-400 line-clamp-2">
        {job.description ||
          "Explore this opportunity and learn more about the role."}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-5">

        <Tag>
          💼 {formatJobType(job.jobType)}
        </Tag>

        <Tag>
          🏠 {formatWorkMode(job.workMode)}
        </Tag>

        {job.location && (
          <Tag>
            📍 {job.location}
          </Tag>
        )}

        <Tag>
          {job.paid ? "💰 Paid" : "○ Unpaid"}
        </Tag>

      </div>

      {/* ELIGIBILITY REASON */}
      <div
        className={`mt-5 rounded-xl px-4 py-3 text-sm ${
          job.eligible
            ? "bg-emerald-50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-500/5 text-red-700 dark:text-red-400"
        }`}
      >
        {job.eligibilityReason}
      </div>

      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">

        <button
          onClick={onView}
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          View Details
        </button>

        <button
          disabled={
            !job.eligible ||
            alreadyApplied ||
            applying
          }
          onClick={() =>
            onApply(job.id)
          }
          className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
            alreadyApplied
              ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 cursor-default"
              : !job.eligible
              ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
          }`}
        >
          {alreadyApplied
            ? "✓ Applied"
            : applying
            ? "Applying..."
            : !job.eligible
            ? "Not Eligible"
            : "Apply Now"}
        </button>

      </div>

    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
      {children}
    </span>
  );
}

function formatJobType(type) {
  if (!type) return "Job";

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function formatWorkMode(mode) {
  if (!mode) return "Flexible";

  return mode
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

export default StudentJobs;