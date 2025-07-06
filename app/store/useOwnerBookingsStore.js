import { create } from "zustand";
import { request } from "../util/request";

export const useOwnerBookingsStore = create((set) => ({
  bookings: [],
  loading: false,
  error: null,

  getOwnerBookings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request("/bookings", "GET");
      set({ bookings: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
