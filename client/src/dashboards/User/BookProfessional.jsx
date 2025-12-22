// src/dashboards/User/BookProfessional.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authAxios from "../../api";
import toast from "react-hot-toast";

const BookProfessional = () => {
  const { id } = useParams(); // professional ID from route
  const navigate = useNavigate();

  const [form, setForm] = useState({
    service_id: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/bookings", {
        professional_id: id,
        ...form,
      });
      toast.success("Booking created successfully!");
      navigate("/user-dashboard/bookings/confirmation");
    } catch (err) {
      toast.error("Failed to create booking");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-500">
        Book Professional
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="service_id"
          placeholder="Service ID"
          value={form.service_id}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-800"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-800"
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none text-gray-800"
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none text-gray-800"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-purple-600 transition px-4 py-3 rounded-lg text-white font-semibold shadow-md"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookProfessional;
