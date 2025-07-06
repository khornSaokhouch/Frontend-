"use client";
import { useEffect } from "react";
import { useNotificationStore } from "../store/useNotificationStore";

export default function NotificationsPanel() {
  const {
    notifications,
    getNotifications,
    loading,
    error,
    markAsRead,
  } = useNotificationStore();

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-md w-full border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
        Notifications
      </h2>

      {loading && (
        <p className="text-gray-500 italic text-center py-4">Loading...</p>
      )}
      {error && (
        <p className="text-red-600 text-center font-semibold py-4">{error}</p>
      )}

      {notifications.length === 0 && !loading && !error && (
        <p className="text-gray-400 italic text-center py-6">No notifications</p>
      )}

      {notifications.length > 0 && (
        <ul className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-3 rounded-md border ${
                n.is_read
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-300 font-semibold shadow-sm"
              } flex flex-col`}
            >
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1 mb-2">
                {new Date(n.created_at).toLocaleString()}
              </p>

              {!n.is_read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="self-start text-blue-600 text-xs underline hover:text-blue-800 focus:outline-none transition"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
