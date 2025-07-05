import { create } from 'zustand';
import { request } from '../util/request'; // adjust path accordingly

export const useOwnerBookingStore = create((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  actionLoadingId: null,
  rejectionReasons: {},

  newBookingNotification: null,

  fetchBookings: async (status = '') => {
    set({ loading: true, error: null });
    try {
      const query = status && status !== 'all' ? `?status=${status}` : '';
      const url = `/api/owner/bookings${query}`;
      const data = await request(url, 'GET');

      const oldIds = new Set(get().bookings.map(b => b.id));
      const newBookings = data.filter(b => !oldIds.has(b.id));
      if (newBookings.length > 0) {
        set({ newBookingNotification: `You have ${newBookings.length} new booking(s)!` });
      }

      set({ bookings: data, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load bookings', loading: false });
    }
  },

  clearNotification: () => set({ newBookingNotification: null }),

  // Add your other actions, e.g., setRejectionReason, respondToBooking, etc.
}));
