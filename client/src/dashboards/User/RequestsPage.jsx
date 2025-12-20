// src/dashboards/User/RequestsPage.jsx
import useBookings from "../../hooks/useBookings";

const RequestsPage = () => {
  const { bookings, loading, error } = useBookings("user");

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-black/70 rounded-xl p-6">
      <h2 className="text-xl font-bold text-accent mb-4">My Requests</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-400">No requests yet</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => (
            <li key={b._id} className="p-4 bg-gray-800 rounded-lg">
              <p className="text-white">Service: {b.service_id}</p>
              <p className="text-gray-400">Status: {b.status}</p>
              <p className="text-gray-400">Date: {b.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestsPage;
