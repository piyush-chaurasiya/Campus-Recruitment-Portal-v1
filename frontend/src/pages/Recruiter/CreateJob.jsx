import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function CreateJob() {
  const navigate = useNavigate();
  const [job, setJob] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJob((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...job,
        stipendOrSalary: job.stipendOrSalary
          ? Number(job.stipendOrSalary)
          : null,
        minimumCgpa: job.minimumCgpa ? Number(job.minimumCgpa) : null,
        maximumBacklogs: job.maximumBacklogs
          ? Number(job.maximumBacklogs)
          : null,
        minimumTenthPercentage: job.minimumTenthPercentage
          ? Number(job.minimumTenthPercentage)
          : null,
        minimumTwelfthPercentage: job.minimumTwelfthPercentage
          ? Number(job.minimumTwelfthPercentage)
          : null,
        applicationDeadline: job.applicationDeadline || null,
        joiningDate: job.joiningDate || null,
      };

      await api.post("/api/recruiter/jobs", payload);

      navigate("/recruiter/jobs");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to post job."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Post New Job</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Create a new placement opportunity for students. It will be
          submitted for approval before students can see it.
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          ⚠️ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Job Title"
            name="title"
            value={job.title}
            onChange={handleChange}
            placeholder="Example: Java Software Engineer"
            required
          />

          <Input
            label="Company Name"
            name="companyName"
            value={job.companyName}
            onChange={handleChange}
            placeholder="Example: TechNova Solutions"
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Job Type
            </label>
            <select
              name="jobType"
              value={job.jobType}
              onChange={handleChange}
              className="input"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Work Mode
            </label>
            <select
              name="workMode"
              value={job.workMode}
              onChange={handleChange}
              className="input"
            >
              <option value="ON_SITE">On Site</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          <Input
            label="Location"
            name="location"
            value={job.location}
            onChange={handleChange}
            placeholder="Example: Noida"
          />

          <Input
            label="Stipend / Salary"
            name="stipendOrSalary"
            type="number"
            value={job.stipendOrSalary}
            onChange={handleChange}
            placeholder="Example: 600000"
          />

          <Input
            label="Minimum CGPA"
            name="minimumCgpa"
            type="number"
            step="0.01"
            value={job.minimumCgpa}
            onChange={handleChange}
            placeholder="Example: 7.0"
          />

          <Input
            label="Maximum Backlogs"
            name="maximumBacklogs"
            type="number"
            value={job.maximumBacklogs}
            onChange={handleChange}
            placeholder="Example: 0"
          />

          <Input
            label="Min 10th Percentage"
            name="minimumTenthPercentage"
            type="number"
            step="0.01"
            value={job.minimumTenthPercentage}
            onChange={handleChange}
          />

          <Input
            label="Min 12th Percentage"
            name="minimumTwelfthPercentage"
            type="number"
            step="0.01"
            value={job.minimumTwelfthPercentage}
            onChange={handleChange}
          />

          <Input
            label="Application Deadline"
            type="date"
            name="applicationDeadline"
            value={job.applicationDeadline}
            onChange={handleChange}
          />

          <Input
            label="Joining Date"
            type="date"
            name="joiningDate"
            value={job.joiningDate}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Eligible Branches (comma separated)
          </label>
          <input
            name="eligibleBranches"
            value={job.eligibleBranches}
            onChange={handleChange}
            placeholder="CSE, IT, ECE"
            className="input"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Job Description
          </label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe the job role..."
            className="textarea"
          />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="paid"
            checked={job.paid}
            onChange={handleChange}
            id="paid"
            className="h-4 w-4 accent-blue-600 cursor-pointer"
          />
          <label htmlFor="paid" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            Paid opportunity
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate("/recruiter/jobs")}
            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {submitting ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
  required = false,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        step={step}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input"
      />
    </div>
  );
}

export default CreateJob;
