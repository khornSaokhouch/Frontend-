import { create } from "zustand";
import { request } from "../util/request"; // Your custom request helper
import axios from "axios";

export const useBookingStore = create((set) => ({
  loading: false,
  error: null,
  bookings: [],

  bookService: async (serviceId, bookingDate, notes) => {
    set({ loading: true, error: null });

    try {
      const payload = {
        booking_date: bookingDate,
        notes,
      };

      const res = await request(`/services/${serviceId}/book`, "POST", payload);

      set({ loading: false });
      return res;
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Booking failed";
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  getBookingsByUserId: async (userId) => {
    set({ loading: true, error: null });

    try {
      const bookings = await request(`/bookings/${userId}`, "GET");
      set({ bookings, loading: false });
    } catch (err) {
      if (err?.response?.status === 404) {
        // No bookings found — clear bookings
        set({ bookings: [], loading: false });
      } else {
        const message =
          err?.response?.data?.error || err.message || "Failed to fetch bookings";
        set({ error: message, loading: false });
      }
    }
  },

updateBookingStatus: async (bookingId, status) => {
  set({ loading: true, error: null });
  try {
    const response = await request(
      `/bookings/${bookingId}/status`,
      "PUT",
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking
      ),
      loading: false,
    }));

    return response;
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || "Failed to update status";
    set({ error: message, loading: false });
    throw new Error(message);
  }
},


}));
