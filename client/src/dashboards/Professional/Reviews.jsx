import { useEffect, useState } from "react";
import authAxios from "../../utils/authAxios";
import { Star } from "lucide-react";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await authAxios.get("/reviews/me");
      if (res.data.success) setReviews(res.data.reviews);
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Client Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-slate-600">No reviews yet.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                {r.profile_picture ? (
                  <img src={r.profile_picture} alt={r.client_name} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {r.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{r.client_name}</p>
                  <div className="flex">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={18} className="text-yellow-500" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-slate-700">{r.comment}</p>
              <p className="text-xs text-slate-400 mt-2">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
