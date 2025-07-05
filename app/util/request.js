

import axios from "axios";
import config from "./config";
import { useAuthStore } from "../store/authStore";

export const request = (
  url = "",
  method = "POST", // Default method set to POST if not provided
  data = {},
  customConfig = {}
) => {
  // Safely retrieve the token from authStore
  const token = useAuthStore.getState()?.getToken?.();

  const isFormData = data instanceof FormData;

  return axios({
   url: `${config.base_url}${url}`,
    method,
    data,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }), // Don't set Content-Type if FormData
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customConfig.headers, // Allow custom headers to override
    },
    ...customConfig, // Allow custom config (like params, timeout, etc.)
  })
    .then((response) => response.data) // Return the response data
    .catch((error) => {
      console.error("API request error:", error);
      throw error; // Rethrow for further handling
    });
};
