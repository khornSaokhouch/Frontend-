import { create } from "zustand";
import { request } from "../util/request";

export const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/admin/users", "GET");
      set({ users: res.users || [] });
    } catch (err) {
      set({ users: [], error: err.message || "Failed to load users" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateUserRole: async (userId, role) => {
    set({ loading: true, error: null });
    try {
      await request(`/admin/users/${userId}`, "PUT", { role });
      // Update local user list
      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId ? { ...u, role } : u
        ),
      }));
    } catch (err) {
      set({ error: err.message || "Failed to update role" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      await request(`/admin/users/${userId}`, "DELETE");
      set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
      }));
    } catch (err) {
      set({ error: err.message || "Failed to delete user" });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
