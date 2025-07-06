import { create } from "zustand";
import { request } from "../util/request";
import { useAuthStore } from "./authStore";

export const useBookingStore = create((set) => ({
  bookings: [],
  loading: false,
  error: null,

  // 1. Book a service (POST /services/{service}/book)
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


  // 2. Get bookings for services owned by a user (GET /bookings/{userId})
  getBookingsByUserId: async (userId) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().getToken();

      const res = await request(`/bookings/${userId}`, "GET", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // May return a list or a { message: "No bookings..." } response
      if (Array.isArray(res)) {
        set({ bookings: res });
      } else {
        set({ bookings: [] });
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch bookings";
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  // 3. Update booking status (PUT /bookings/{bookingId}/status)
  updateBookingStatus: async (bookingId, status) => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().getToken();

      const res = await request(
        `/bookings/${bookingId}/status`,
        "PUT",
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local store if booking updated
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? res.booking : b
        ),
      }));

      return res;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update booking status";
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // 4. Accept or Reject Booking (PATCH /bookings/{bookingId}/respond)
  respondToBooking: async (bookingId, status, rejection_reason = "") => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().getToken();

      const payload = {
        status,
        rejection_reason: status === "rejected" ? rejection_reason : null,
      };

      const res = await request(
        `/bookings/${bookingId}/respond`,
        "PATCH",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? res.booking : b
        ),
      }));

      return res;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to respond to booking";
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },

  // Optional: Fetch single booking by ID
  getBookingById: async (bookingId) => {
    try {
      const token = useAuthStore.getState().getToken();

      const booking = await request(`/bookings/${bookingId}`, "GET", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return booking;
    }  catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to respond to booking";
      set({ error: msg });
      throw new Error(msg);
    } finally {
      set({ loading: false });
    }
  },
}));
