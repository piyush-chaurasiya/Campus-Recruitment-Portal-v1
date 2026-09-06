import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

const statusStyles = {
  SCHEDULED: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function StudentInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/student/interviews");
      setInterviews(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  const counts = useMemo(() => {
    return {
      all: interviews.length,
      upcoming: interviews.filter((i) => i.status === "SCHEDULED").length,
      completed: interviews.filter((i) => i.status === "COMPLETED").length,
      cancelled: interviews.filter((i) => i.status === "CANCELLED").length,
    };
  }, [interviews]);

  const filtered = useMemo(() => {
    if (filter === "ALL") return interviews;
    if (filter === "UPCOMING") return interviews.filter((i) => i.status === "SCHEDULED");
    if (filter === "COMPLETED") return interviews.filter((i) => i.status === "COMPLETED");
    if (filter === "CANCELLED") return interviews.filter((i) => i.status === "CANCELLED");
    return interviews;
  }, [filter, interviews]);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
          INTERVIEW CENTER
        </p>

        <h1 className="text-3xl md:text-4xl font-bold">Interviews</h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Keep track of your scheduled interviews, virtual meeting links, and feedback.
        </p>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Total" value={counts.all} icon="🎯" />
        <Stat title="Upcoming" value={counts.upcoming} icon="📅" />
        <Stat title="Completed" value={counts.completed} icon="✅" />
        <Stat title="Cancelled" value={counts.cancelled} icon="❌" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          ["ALL", `All (${counts.all})`],
          ["UPCOMING", `Upcoming (${counts.upcoming})`],
          ["COMPLETED", `Completed (${counts.completed})`],
          ["CANCELLED", `Cancelled (${counts.cancelled})`],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              filter === value
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-xl font-bold">No interviews found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Interview invites from recruiters will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {item.companyName}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                      {item.jobTitle} · <span className="font-medium text-blue-500">{item.roundName || "Interview Round"}</span>
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[item.status] || statusStyles.SCHEDULED
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Date & Time</p>
                    <p className="font-medium mt-1">
                      📅 {new Date(item.scheduledTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mode & Duration</p>
                    <p className="font-medium mt-1">
                      {item.mode === "ONLINE" ? "💻 Online" : "🏢 Offline"} · {item.durationMinutes}m
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-sm">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Meeting Info / Venue</p>
                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink.startsWith("http") ? item.meetingLink : `https://${item.meetingLink}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-400 underline block truncate mt-1"
                    >
                      🔗 {item.meetingLink}
                    </a>
                  ) : (
                    <p className="font-medium mt-1 truncate">{item.location || "Campus Placement Cell"}</p>
                  )}
                </div>

                {item.notes && (
                  <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-300">
                    <span className="font-semibold">Recruiter Notes: </span>
                    {item.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">{title}</p>
      <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

export default StudentInterviews;
