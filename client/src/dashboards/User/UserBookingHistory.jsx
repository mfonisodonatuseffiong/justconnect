// src/dashboards/User/UserBookingHistory.jsx
import React, { useEffect, useState } from "react";
import authAxios from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Loader } from "lucide-react";

export default function UserBookingHistory({ userId: userIdProp }) {
  const { user } = useAuthStore();
  const userId = userIdProp || user?.id;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  const normalize = (s) => (s || "").toString().trim().toLowerCase();
  const isHistoryStatus = (s) => {
    const st = normalize(s);
    return st === "completed" || st === "cancelled" || st === "canceled";
  };

  useEffect(() => {
    let mounted = true;
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await authAxios.get(`/bookings/user/${userId}/history`);
        if (mounted && res?.data?.success) {
          const rows = (res.data.data || []).filter((b) => isHistoryStatus(b.status));
          setBookings(rows);
          setLoading(false);
          return;
        }
      } catch {
        // fallback
      }

      try {
        const resAll = await authAxios.get(`/bookings/user/${userId}`);
        if (!mounted) return;
        const all = resAll?.data?.data || [];
        const rows = all.filter((b) => isHistoryStatus(b.status));
        setBookings(rows);
      } catch (err) {
        if (!mounted) return;
        setError("Failed to load booking history");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[20vh] text-blue-500">
        <Loader className="animate-spin mr-2" />
        Loading booking history…
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 py-6 text-center">{error}</div>;
  }

  if (!bookings.length) {
    return <div className="text-slate-600 text-center py-12">No booking history yet.</div>;
  }

  return (
    <div className="space-y-6">
      {bookings.map((b) => {
        const status = normalize(b.status);
        const statusClasses =
          status === "completed"
            ? "bg-green-100 text-green-700 border-green-300"
            : "bg-red-100 text-red-700 border-red-300";

        return (
          <div
            key={b.id}
            className="bg-gradient-to-r from-purple-50 via-white to-orange-50 border border-slate-200 rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-rose-700">
                  {b.service_name || `Service #${b.service_id}`}
                </h3>
                <p className="text-sm text-slate-500">Booking ID: #{b.id}</p>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold border ${statusClasses}`}
              >
                {b.status.replace("_", " ")}
              </span>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="bg-blue-100/40 p-2 rounded-md">
                <strong className="text-orange-700">Professional:</strong>{" "}
                {b.professional_name || `#${b.professional_id}`}
              </div>
              <div className="bg-orange-100/40 p-2 rounded-md">
                <strong className="text-orange-700">Date & Time:</strong> {b.date} at {b.time}
              </div>
              {b.notes && (
                <div className="md:col-span-2 bg-green-100/40 p-2 rounded-md">
                  <strong className="text-green-700">Notes:</strong> {b.notes}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
