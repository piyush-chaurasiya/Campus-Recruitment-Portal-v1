import { useEffect, useState } from "react";
import api from "../../api/axios";

function PlacementNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/placement/notifications");
      setNotifications(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/api/placement/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update notification."
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/api/placement/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to mark all as read."
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
            NOTIFICATIONS
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Stay updated on new applications and placement activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium self-start transition cursor-pointer shadow-sm"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No notifications yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            You'll be notified here when students apply to your drives.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`border rounded-2xl p-5 flex items-start justify-between gap-4 transition ${
                n.read
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  : "bg-blue-50/60 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">
                  {n.read ? "🔔" : "🔵"}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                    {n.message}
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium shrink-0 cursor-pointer"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlacementNotifications;
