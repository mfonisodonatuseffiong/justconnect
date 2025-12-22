import useBookings from "../../hooks/useBookings";

const BookingsPage = () => {
  const { bookings, loading, error } = useBookings("user");

  if (loading) return <p className="text-gray-400">Loading bookings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-white">
      <div className="bg-purple-950/60 border border-purple-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-accent mb-6">Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet</p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li
                key={b._id}
                className="p-4 bg-purple-950/40 border border-purple-800 rounded-xl shadow-md"
              >
                <p className="text-purple-300 font-semibold">
                  Service: {b.service_id}
                </p>
                <p className="text-gray-300">
                  Professional: {b.professional_id}
                </p>
                <p className="text-gray-400">Status: {b.status}</p>
                <p className="text-gray-500 text-sm">Date: {b.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
