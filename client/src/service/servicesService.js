/**
 * @description Service API calls
 * Provides functions to fetch services and professionals from the PostgreSQL backend
 */

import authAxios from "../utils/authAxios";

/**
 * Fetch all services (categories)
 * @returns {Promise<Array>} list of services
 */
export const getServices = async () => {
  try {
    const res = await authAxios.get("/services");
    return res.data.data || res.data || [];
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    throw err?.response?.data?.message || "Failed to fetch services";
  }
};

/**
 * Fetch professionals with optional filters and pagination
 * @param {Object} params - filter options
 * @param {string} [params.service] - service name (e.g. "Plumbing", "Electrical") – backend must filter by this
 * @param {string} [params.search] - search term (name, skill, etc.)
 * @param {string} [params.location] - location filter
 * @param {number} [params.page=1] - page number
 * @param {number} [params.limit=12] - results per page
 * @returns {Promise<{data: Array, total: number}>}
 */
export const getProfessionals = async (params = {}) => {
  try {
    // Clean and log params for debugging
    const cleanParams = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = value;
      }
    });

    console.log("getProfessionals → Sending params to backend:", cleanParams);

    const res = await authAxios.get("/professionals", { params: cleanParams });

    // Backend should return { data: [...], total: number } or similar
    const data = res.data.data || res.data.professionals || res.data || [];
    const total = res.data.total || res.data.count || data.length || 0;

    console.log("getProfessionals → Received:", data.length, "professionals, total:", total);

    return { data, total };
  } catch (err) {
    console.error("❌ Error fetching professionals:", err);
    const message = err?.response?.data?.message || "Failed to fetch professionals";
    throw new Error(message);
  }
};

/**
 * Fetch single professional by ID
 * @param {string|number} id - professional ID
 * @returns {Promise<Object>} professional object
 */
export const getProfessionalById = async (id) => {
  try {
    const res = await authAxios.get(`/professionals/${id}`);
    return res.data.data || res.data || null;
  } catch (err) {
    console.error("❌ Error fetching professional by ID:", err);
    throw err?.response?.data?.message || "Failed to fetch professional";
  }
};