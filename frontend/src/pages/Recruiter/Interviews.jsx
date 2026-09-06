import { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColors = {
  SCHEDULED: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [applicationId, setApplicationId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [mode, setMode] = useState("ONLINE");
  const [roundName, setRoundName] = useState("Technical Round 1");
  const [meetingLink, setMeetingLink] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [interviewsRes, appsRes] = await Promise.all([
        api.get("/api/recruiter/interviews"),
        api.get("/api/recruiter/applications"),
      ]);

      setInterviews(interviewsRes.data || []);
      setApplications(appsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!applicationId || !scheduledDate || !scheduledTime) {
      setError("Please select a candidate, date, and time.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const combinedDateTime = `${scheduledDate}T${scheduledTime}:00`;

      await api.post("/api/recruiter/interviews", {
        applicationId: Number(applicationId),
        scheduledTime: combinedDateTime,
        durationMinutes: Number(durationMinutes),
        mode,
        roundName,
        meetingLink: mode === "ONLINE" ? meetingLink : null,
        location: mode === "OFFLINE" ? location : null,
        notes,
      });

      setMessage("Interview scheduled successfully! Notification sent to student.");
      setShowForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setError("");
      setMessage("");
      await api.put(`/api/recruiter/interviews/${id}/status`, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`,
      });
      setMessage(`Interview marked as ${newStatus}.`);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update interview status.");
    }
  };

  const resetForm = () => {
    setApplicationId("");
    setScheduledDate("");
    setScheduledTime("");
    setDurationMinutes("45");
    setMode("ONLINE");
    setRoundName("Technical Round 1");
    setMeetingLink("");
    setLocation("");
    setNotes("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Interviews</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Schedule and manage student candidate interviews.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setMessage("");
            setShowForm(!showForm);
          }}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition cursor-pointer shadow-md shadow-blue-500/20"
        >
          {showForm ? "✕ Close Form" : "+ Schedule Interview"}
        </button>
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

      {/* Schedule Form */}
      {showForm && (
        <form onSubmit={handleSchedule} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Schedule New Interview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Applicant *</label>
              <select
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                required
                className="input"
              >
                <option value="">-- Choose Candidate & Job --</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.studentName} ({app.studentEmail}) — {app.jobTitle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Round Name</label>
              <input
                value={roundName}
                onChange={(e) => setRoundName(e.target.value)}
                placeholder="e.g. Technical Round 1, HR Interview"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date *</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Time *</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="input"
              >
                <option value="ONLINE">Online (Virtual Meeting)</option>
                <option value="OFFLINE">Offline (In-Person)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Duration (Minutes)</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="input"
              >
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>

            {mode === "ONLINE" ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Meeting Link</label>
                <input
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz-abc or Zoom URL"
                  className="input"
                />
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location / Venue</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Conference Room A, Main Campus"
                  className="input"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes / Instructions for Student</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Bring resume, project portfolio, or prepare for coding questions..."
                rows={3}
                className="textarea"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/20"
            >
              {submitting ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </form>
      )}

      {/* Interviews List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No interviews scheduled yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Click &quot;+ Schedule Interview&quot; above to schedule an interview with an applicant.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{interview.studentName}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{interview.studentEmail}</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm mt-1 font-medium">
                      {interview.jobTitle} · {interview.roundName || "Interview"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[interview.status] || statusColors.SCHEDULED
                    }`}
                  >
                    {interview.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Scheduled Date & Time</p>
                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      📅 {new Date(interview.scheduledTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Mode & Duration</p>
                    <p className="mt-1 font-medium text-slate-900 dark:text-white">
                      {interview.mode === "ONLINE" ? "💻 Online" : "🏢 Offline"} · {interview.durationMinutes}m
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 col-span-2 sm:col-span-1 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 dark:text-slate-500">Location / Link</p>
                    {interview.meetingLink ? (
                      <a
                        href={interview.meetingLink.startsWith("http") ? interview.meetingLink : `https://${interview.meetingLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 font-medium text-blue-600 dark:text-blue-400 underline block truncate"
                      >
                        Join Meeting ↗
                      </a>
                    ) : (
                      <p className="mt-1 font-medium text-slate-900 dark:text-white truncate">{interview.location || "Campus"}</p>
                    )}
                  </div>
                </div>

                {interview.notes && (
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800/50">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Notes: </span>
                    {interview.notes}
                  </div>
                )}
              </div>

              {interview.status === "SCHEDULED" && (
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleStatusUpdate(interview.id, "COMPLETED")}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 font-medium transition cursor-pointer"
                  >
                    ✓ Mark Completed
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(interview.id, "CANCELLED")}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-600/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600/30 font-medium transition cursor-pointer"
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Interviews;
