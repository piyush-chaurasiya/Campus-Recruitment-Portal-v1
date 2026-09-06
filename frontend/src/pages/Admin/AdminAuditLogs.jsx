import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/admin/logs");
      setLogs(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            SECURITY & AUDIT
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">Audit Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Real-time tracking of user management and system operations.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium transition cursor-pointer self-start sm:self-auto"
        >
          🔄 Refresh Logs
        </button>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          ⚠️ {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="font-semibold text-lg">No audit events found</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-5 border-b last:border-b-0 border-slate-200 dark:border-slate-800 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                {log.icon || "📋"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {log.action?.replaceAll("_", " ")}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    {log.actor}
                  </span>
                </div>

                {log.details && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {log.details}
                  </p>
                )}
              </div>

              <span className="text-xs text-slate-400 whitespace-nowrap pt-1">
                {new Date(log.timestamp).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminAuditLogs;
