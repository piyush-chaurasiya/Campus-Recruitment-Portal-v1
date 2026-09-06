import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = {
  companyName: "",
  website: "",
  industry: "",
  location: "",
  description: "",
};

function CompanyProfile() {
  const [form, setForm] = useState(emptyForm);
  const [recruiter, setRecruiter] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/recruiter/profile");
      const data = response.data || {};

      setForm({
        companyName: data.companyName || "",
        website: data.website || "",
        industry: data.industry || "",
        location: data.location || "",
        description: data.description || "",
      });

      setRecruiter({
        name: data.recruiterName,
        email: data.recruiterEmail,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await api.put("/api/recruiter/profile", form);
      setMessage("Company profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Company Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Update the company information shown alongside your job
          postings.
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

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-400 dark:text-slate-500">Recruiter Account</p>
        <p className="font-semibold text-slate-900 dark:text-white mt-1">{recruiter.name || "Recruiter"}</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{recruiter.email}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Company Name
          </label>
          <input
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="Example: TechNova Solutions"
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Website
          </label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Industry
          </label>
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="Example: Information Technology"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Example: Bangalore, India"
            className="input"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Company Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            placeholder="Tell students about your company..."
            className="textarea"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompanyProfile;
