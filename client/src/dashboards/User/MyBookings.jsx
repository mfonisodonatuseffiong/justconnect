// src/dashboards/User/MyBookings.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authAxios from "../../api";
import { useAuthStore } from "../../store/authStore";
import { Loader, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  pending: "bg-orange-100 text-orange-700 border-orange-300",
  in_progress: "bg-amber-100 text-amber-700 border-amber-300",
  accepted: "bg-amber-50 text-amber-700 border-amber-300",
  completed: "bg-rose-100 text-rose-700 border-rose-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  canceled: "bg-red-100 text-red-700 border-red-300", // tolerate alternate spelling
};

const normalize = (s) => (s || "").toString().trim().toLowerCase();

export default function MyBookings() {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const initialTab = location.pathname.includes("/bookings/history") ? "history" : "active";
  const [tab, setTab] = useState(initialTab);

  const [loading, setLoading] = useState(true);
  const [activeBookings, setActiveBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [error, setError] = useState(null);

  // Fetch active bookings (client-side filter from /bookings/user/:id)
  const fetchActive = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await authAxios.get(`/bookings/user/${user.id}`);
      const all = res?.data?.data || [];
      const act = all.filter((b) =>
        ["pending", "accepted", "in_progress"].includes(normalize(b.status))
      );
      setActiveBookings(act);
    } catch (err) {
      console.error("Failed to fetch active bookings:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch history from dedicated endpoint; fallback to client-side filter if endpoint fails
  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await authAxios.get(`/bookings/user/${user.id}/history`);
      if (res?.data?.success) {
        // ensure only completed/cancelled are shown
        const rows = (res.data.data || []).filter((b) =>
          ["completed", "cancelled", "canceled"].includes(normalize(b.status))
        );
        setHistoryBookings(rows);
        setLoading(false);
        return;
      }
    } catch (err) {
      // fall through to fallback
      // console.debug("history endpoint failed, falling back:", err);
    }

    // fallback: fetch all and filter
    try {
      const resAll = await authAxios.get(`/bookings/user/${user.id}`);
      const all = resAll?.data?.data || [];
      const rows = all.filter((b) =>
        ["completed", "cancelled", "canceled"].includes(normalize(b.status))
      );
      setHistoryBookings(rows);
    } catch (err) {
      console.error("Failed to fetch booking history fallback:", err);
      setError("Failed to load booking history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // keep tab in sync with URL (back/forward)
    if (location.pathname.includes("/bookings/history")) setTab("history");
    else setTab("active");
  }, [location.pathname]);

  useEffect(() => {
    // initial load
    if (tab === "history") fetchHistory();
    else fetchActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, tab]);

  // Cancel action: update status to 'cancelled' so it moves to history.
  // If the status-update endpoint is not available, fallback to delete.
  const handleCancel = async (id) => {
    try {
      // Try to update status first (preferred)
      await authAxios.patch(`/bookings/${id}/status`, { status: "cancelled" });
      toast.success("Booking cancelled");
    } catch (err) {
      // fallback: delete if update not supported
      try {
        await authAxios.delete(`/bookings/${id}`);
        toast.success("Booking removed");
      } catch (delErr) {
        console.error("Cancel/delete failed:", delErr);
        toast.error("Failed to cancel booking");
        return;
      }
    } finally {
      // refresh both lists so UI moves the item to history
      fetchActive();
      fetchHistory();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-orange-500">
        <Loader className="animate-spin mr-2" />
        Loading bookings…
      </div>
    );
  }

  return (
    <div className="bg-orange-50 min-h-screen p-6">
      <div className="bg-white border border-orange-200 rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-orange-600">My Bookings</h1>

          <div className="flex gap-2">
            <button
              onClick={() => {
                navigate("/user-dashboard/bookings");
                setTab("active");
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                tab === "active" ? "bg-orange-600 text-white" : "bg-orange-100 text-orange-700"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => {
                navigate("/user-dashboard/bookings/history");
                setTab("history");
              }}
              className={`px-4 py-2 rounded-lg font-medium ${
                tab === "history" ? "bg-orange-600 text-white" : "bg-orange-100 text-orange-700"
              }`}
            >
              Booking History
            </button>
          </div>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {tab === "active" && (
          <>
            {activeBookings.length === 0 ? (
              <p className="text-slate-600 text-center py-16">You have no active bookings.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border border-orange-200 rounded-xl overflow-hidden">
                  <thead className="bg-orange-100 text-orange-700">
                    <tr>
                      <th className="p-3 text-left">Service</th>
                      <th className="p-3 text-left">Professional</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Time</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activeBookings.map((b) => (
                      <motion.tr
                        key={b.id}
                        whileHover={{ scale: 1.01 }}
                        className="border-t border-orange-200 hover:bg-orange-50 transition"
                      >
                        <td className="p-3 text-slate-800 font-medium">
                          {b.service_name || `Service #${b.service_id}`}
                        </td>

                        <td className="p-3 text-slate-600">
                          {b.professional_name || `Pro #${b.professional_id}`}
                        </td>

                        <td className="p-3 text-slate-600">{b.date}</td>
                        <td className="p-3 text-slate-600">{b.time}</td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                              STATUS_STYLES[normalize(b.status)] ||
                              "bg-slate-100 text-slate-600 border-slate-300"
                            }`}
                          >
                            {(b.status || "").replace("_", " ")}
                          </span>
                        </td>

                        <td className="p-3">
                          {normalize(b.status) === "pending" && (
                            <button
                              onClick={() => handleCancel(b.id)}
                              className="
                                flex items-center gap-2
                                px-3 py-1
                                bg-red-500 text-white
                                rounded-lg
                                hover:bg-red-600
                                transition
                              "
                            >
                              <XCircle size={16} />
                              Cancel
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "history" && (
          <>
            {historyBookings.length === 0 ? (
              <p className="text-slate-600 text-center py-16">No booking history yet.</p>
            ) : (
              <div className="space-y-4">
                {historyBookings.map((b) => (
                  <div key={b.id} className="bg-white border border-orange-100 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          {b.service_name || `Service #${b.service_id}`}
                        </h3>
                        <div className="text-sm text-slate-600">Booking ID: #{b.id}</div>
                        <div className="text-sm text-slate-600">
                          Professional: {b.professional_name || `#${b.professional_id}`}
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
                            normalize(b.status) === "completed"
                              ? "bg-rose-100 text-rose-700 border-rose-300"
                              : "bg-red-100 text-red-700 border-red-300"
                          }`}
                        >
                          {(b.status || "").replace("_", " ")}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-slate-700">
                      <div><strong>Date & Time:</strong> {b.date} at {b.time}</div>
                      {b.notes && <div className="mt-2"><strong>Notes:</strong> {b.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
