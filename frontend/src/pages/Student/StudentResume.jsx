import { useEffect, useState } from "react";
import api from "../../api/axios";

function StudentResume() {
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/student/resume",
        {
          responseType: "blob",
        }
      );

      const blob = response.data;

      const filename =
        getFilename(response.headers["content-disposition"]) ||
        "resume.pdf";

      const file = new File(
        [blob],
        filename,
        {
          type: "application/pdf",
        }
      );

      setResume(file);

    } catch (err) {

      if (err.response?.status === 404) {
        setResume(null);
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load resume."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage("");
    setError("");

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF document.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await api.post(
        "/api/student/resume",
        formData
      );

      setResume(file);

      setMessage(
        response.data?.message ||
          "Resume uploaded successfully."
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Unable to upload resume."
      );

    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeResume = async () => {

    if (!resume) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove your resume?"
    );

    if (!confirmed) return;

    try {

      setDeleting(true);
      setError("");
      setMessage("");

      const response = await api.delete(
        "/api/student/resume"
      );

      setResume(null);

      setMessage(
        response.data?.message ||
          "Resume deleted successfully."
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Unable to delete resume."
      );

    } finally {
      setDeleting(false);
    }
  };

  const viewResume = async () => {

    try {

      setError("");

      const response = await api.get(
        "/api/student/resume",
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(
        response.data
      );

      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Unable to open resume."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7">

      {/* HEADER */}

      <div>
        <p className="mb-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          CAREER DOCUMENTS
        </p>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          My Resume
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Keep your latest resume ready for placement
          opportunities.
        </p>
      </div>

      {/* SUCCESS */}

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
          ✓ {message}
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          ⚠ {error}
        </div>
      )}

      {/* RESUME */}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">

        {!resume ? (

          <label className="block cursor-pointer">

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile}
              disabled={uploading}
              className="hidden"
            />

            <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center transition hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-slate-700 dark:hover:bg-indigo-500/5">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl dark:bg-indigo-500/10">
                📄
              </div>

              <h2 className="mt-5 text-xl font-bold">
                {uploading
                  ? "Uploading..."
                  : "Upload your resume"}
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                PDF up to 5 MB
              </p>

              <span className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">
                {uploading
                  ? "Please wait..."
                  : "Choose Resume"}
              </span>

            </div>

          </label>

        ) : (

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-2xl dark:bg-red-500/10">
                📄
              </div>

              <div>

                <h3 className="font-bold">
                  {resume.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {(resume.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={viewResume}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white transition hover:bg-indigo-700"
              >
                View Resume
              </button>

              <label className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 font-semibold dark:border-slate-700">

                Replace

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFile}
                  disabled={uploading}
                  className="hidden"
                />

              </label>

              <button
                onClick={removeResume}
                disabled={deleting}
                className="rounded-xl border border-red-200 px-4 py-2.5 font-semibold text-red-600 dark:border-red-500/20 dark:text-red-400 disabled:opacity-60"
              >
                {deleting
                  ? "Removing..."
                  : "Remove"}
              </button>

            </div>

          </div>
        )}

      </div>

      {/* INFO */}

      <div className="grid gap-4 md:grid-cols-3">

        <InfoCard
          icon="🔒"
          title="Private"
          text="Your resume is stored securely with your student profile."
        />

        <InfoCard
          icon="⚡"
          title="Quick Apply"
          text="Keep your resume ready so you can apply faster."
        />

        <InfoCard
          icon="🔄"
          title="Always Updated"
          text="Replace your resume whenever you have a newer version."
        />

      </div>

    </div>
  );
}

function getFilename(contentDisposition) {

  if (!contentDisposition) return null;

  const match =
    contentDisposition.match(
      /filename="?([^"]+)"?/i
    );

  return match ? match[1] : null;
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

      <div className="text-2xl">
        {icon}
      </div>

      <h3 className="mt-3 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default StudentResume;