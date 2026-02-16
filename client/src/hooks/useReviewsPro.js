// src/hooks/useReviewsPro.js
import { useEffect, useState } from "react";
import authAxios from "../utils/authAxios";
import { useAuthStore } from "../store/authStore";

const useReviewsPro = () => {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchReviews = async () => {
      try {
        const res = await authAxios.get(`/reviews/pro/${user.id}`);
        setReviews(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [user?.id]);

  return { reviews, loading };
};

export default useReviewsPro;
