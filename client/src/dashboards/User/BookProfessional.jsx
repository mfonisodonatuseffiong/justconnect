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
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Book Professional</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="service_id"
          placeholder="Service ID"
          value={form.service_id}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <button
          type="submit"
          className="bg-accent px-4 py-2 rounded text-white"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookProfessional;
