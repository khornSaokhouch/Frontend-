import { create } from "zustand";
import { request } from "../util/request";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  // Fetch notifications
  getNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request("/notifications/owner", "GET");
      set({ notifications: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  

  markAsRead: async (notificationId) => {
    try {
        await request(`/notifications/${notificationId}/read`, "PUT");

      // Optimistically update state
      const updated = get().notifications.map((n) =>
        n.id === notificationId ? { ...n, is_read: true } : n
      );
      set({ notifications: updated });
    } catch (err) {
      console.error('Failed to mark as read', err.message);
      set({ error: err.message });
    }
  },

  // Optional: mark all as read
  markAllAsRead: async () => {
    try {
      await request(`/notifications/mark-all-read`, "PATCH");

      const updated = get().notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      set({ notifications: updated });
    } catch (err) {
      console.error("Failed to mark all as read", err.message);
    }
  },
}));
