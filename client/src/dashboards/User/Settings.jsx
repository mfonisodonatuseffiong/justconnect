import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import authAxios from "../../api";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    profile_pic: user.profile_pic || "",
    location: user.location || "",
    contact: user.contact || "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAxios.put(`/users/${user.id}`, form);
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" />
        <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" />
        <input name="profile_pic" value={form.profile_pic} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" />
        <input name="location" value={form.location} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" />
        <input name="contact" value={form.contact} onChange={handleChange} className="w-full p-2 rounded bg-gray-800 text-white" />
        <button type="submit" className="bg-accent px-4 py-2 rounded text-white">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;
