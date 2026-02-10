// src/dashboards/Admin/AdminProfessionals.jsx
import { useEffect, useState } from "react";
import authAxios from "../../api";

const AdminProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await authAxios.get("/admin/professionals");
        setProfessionals(res.data || []);
      } catch (err) {
        console.error("Failed to fetch professionals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this professional?")) return;

    try {
      await authAxios.delete(`/admin/professionals/${id}`);
      setProfessionals(professionals.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete professional:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await authAxios.put(`/admin/professionals/${id}/approve`);
      setProfessionals(professionals.map((p) => (p.id === id ? { ...p, approved: true } : p)));
    } catch (err) {
      console.error("Failed to approve professional:", err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-orange-600">Manage Professionals</h1>

      {loading ? (
        <p className="text-center text-slate-500">Loading professionals...</p>
      ) : professionals.length === 0 ? (
        <p className="text-center text-slate-500">No professionals found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-md border border-orange-100">
            <thead>
              <tr className="bg-orange-50 text-slate-700 font-semibold">
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Service</th>
                <th className="px-6 py-4 text-left">Approved</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map((pro) => (
                <tr key={pro.id} className="border-t border-orange-100 hover:bg-orange-50 transition">
                  <td className="px-6 py-4">{pro.id}</td>
                  <td className="px-6 py-4 font-medium">{pro.name}</td>
                  <td className="px-6 py-4">{pro.email}</td>
                  <td className="px-6 py-4">{pro.service_name || "N/A"}</td>
                  <td className="px-6 py-4">
                    {pro.approved ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleApprove(pro.id)}
                      disabled={pro.approved}
                      className={`px-4 py-2 rounded-lg text-white transition ${
                        pro.approved ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(pro.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProfessionals;