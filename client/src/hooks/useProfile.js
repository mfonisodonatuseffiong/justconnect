// src/hooks/useProfile.js
import { useState, useEffect } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

const useProfile = (role = "user") => {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfile = async () => {
      try {
        const res = await authAxios.get(`/profile/${user.id}`);
        if (res.data?.success) setUser(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id, setUser]);

  const updateProfile = async (payload) => {
    const res = await authAxios.patch(`/profile/${user.id}`, payload);
    if (res.data?.success) setUser(res.data.data);
    return res.data;
  };

  return { user, loading, updateProfile };
};

export default useProfile;
