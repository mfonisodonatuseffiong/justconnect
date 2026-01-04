// src/dashboards/User/RequestsPage.jsx
import { useEffect, useState } from "react";
import authAxios from "../../utils/authAxios";
import { useAuthStore } from "../../store/authStore";

const RequestsPage = () => {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await authAxios.get(`/dashboard/user/${user.id}?limit=20&page=1`);
        if (res.data?.success) {
          setRequests(res.data.data.requests || []);
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user.id]);

  if (loading) return <p className="text-center mt-10">Loading requests...</p>;

  return (
    <div className="min-h-screen bg-orange-50 p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-orange-600 mb-8">All Requests</h1>
      {requests.length === 0 ? (
        <p className="text-slate-500">No requests found</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li
              key={req.id}
              className="bg-white border-2 border-orange-200 rounded-xl p-6 shadow-md"
            >
              <p className="font-semibold text-slate-800">
                {req.professional_name}
              </p>
              <p className="text-slate-600">{req.professional_field}</p>
              <p className="text-sm text-slate-500 mt-2">Status: {req.status}</p>
              <p className="text-sm text-slate-500">Created: {req.created_at}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestsPage;
