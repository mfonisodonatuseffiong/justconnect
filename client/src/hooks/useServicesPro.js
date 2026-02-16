// src/hooks/useServicesPro.js
import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

const useServicesPro = () => {
  const { user } = useAuthStore();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchServices = async () => {
      try {
        const res = await authAxios.get(`/services/pro/${user.id}`);
        setServices(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [user?.id]);

  const addService = async (payload) => {
    const res = await authAxios.post("/services", {
      ...payload,
      professionalId: user.id,
    });
    return res.data;
  };

  const updateService = async (id, payload) => {
    const res = await authAxios.patch(`/services/${id}`, payload);
    return res.data;
  };

  return { services, loading, addService, updateService };
};

export default useServicesPro;
