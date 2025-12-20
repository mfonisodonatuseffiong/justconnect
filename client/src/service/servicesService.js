/**
 * @description: Service API calls
 * Fetch services and professionals from the backend
 */

import authAxios from "../utils/authAxios"; // ✅ FIXED IMPORT

/**
 * Fetch all services
 */
export const getServices = async () => {
  try {
    const res = await authAxios.get("/services");
    return res.data.data;
  } catch (err) {
    console.error("Error fetching services from backend:", err);
    throw err;
  }
};

/**
 * Fetch professionals for a specific service
 * @param {number|string} serviceId
 */
export const getProfessionalsByService = async (serviceId) => {
  try {
    const res = await authAxios.get(`/services/${serviceId}/professionals`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching professionals from backend:", err);
    throw err;
  }
};

/**
 * Fetch all professionals with optional frontend filtering and pagination
 */
export const getProfessionals = async (params = {}) => {
  const { category, location, search, page = 1, limit = 12 } = params;

  try {
    const services = await getServices();
    let professionals = [];

    for (const service of services) {
      const pros = await getProfessionalsByService(service.id);
      professionals = [...professionals, ...pros];
    }

    professionals = professionals.filter((pro) => {
      const matchesLocation = location ? pro.location === location : true;
      const matchesCategory = category
        ? pro.service_name === category || pro.category === category
        : true;
      const matchesSearch = search
        ? pro.name.toLowerCase().includes(search.toLowerCase())
        : true;

      return matchesLocation && matchesCategory && matchesSearch;
    });

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: professionals.slice(start, end),
      total: professionals.length,
    };
  } catch (err) {
    console.error("Error fetching professionals:", err);
    throw err;
  }
};
