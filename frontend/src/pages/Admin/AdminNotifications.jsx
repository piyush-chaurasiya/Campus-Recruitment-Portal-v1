import { useEffect, useState } from "react";
import api from "../../api/axios";

function AdminNotifications() {
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

      const response = await api.get("/api/admin/notifications");
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
      await api.put(`/api/admin/notifications/${id}/read`);
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
      await api.put("/api/admin/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to mark all as read."
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            SYSTEM NOTIFICATIONS
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-1">
            Notifications
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Important verification requests, opportunities, and administrative alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {error && (
        <div className="px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-20 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h2 className="text-xl font-bold">You're all caught up</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            New student verification requests and system alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`p-5 rounded-2xl border transition ${
                notification.read
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  : "bg-blue-50/60 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20 cursor-pointer hover:border-blue-300"
              }`}
            >
              <div className="flex gap-4 items-start">
                <div className="text-2xl pt-0.5">🔔</div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : ""}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {notification.message}
                  </p>
                </div>

                {!notification.read && (
                  <span
                    title="Unread"
                    className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2 shrink-0"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;
