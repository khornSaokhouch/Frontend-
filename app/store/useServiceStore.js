import { create } from "zustand";
import { request } from "../util/request";

export const useServiceStore = create((set) => ({
  services: [],
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/categories', 'GET');
      const cats = Array.isArray(res)
        ? res
        : (res && Array.isArray(res.data) ? res.data : []);
      set({ categories: cats, loading: false });
    }catch (err) {
      console.error("Service fetch error:", err);
      set({ error: 'Failed to fetch services', loading: false });
    }
  },

  fetchServices: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(`filter[${key}]`, val);
      });

      const url = `/services?${params.toString()}`;
      console.log('Fetching services with URL:', url);

      const res = await request(url, 'GET');

      const services = Array.isArray(res)
        ? res
        : (Array.isArray(res.data) ? res.data : []);
      set({ services, loading: false });
    } catch (err) {
      console.error("Service fetch error:", err);
      set({ error: 'Failed to fetch services', loading: false });
    }
  },

   // New: fetch single service by ID
fetchServiceById: async (id) => {
  try {
    const res = await request(`/services/${id}`, 'GET');
    return Array.isArray(res) ? res[0] : res?.data ?? res;
  } catch (err) {
    console.error("Error fetching service:", err);
    throw err;
  }
}


}));
