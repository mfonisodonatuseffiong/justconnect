// src/dashboards/Admin/AdminServices.jsx
import { useEffect, useState } from "react";
import authAxios from "../../api";
import AdminTable from "./AdminTable";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await authAxios.get("/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await authAxios.delete(`/services/${id}`);
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit service", id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-orange-600 mb-8">Services Management</h1>
      {loading ? (
        <p className="text-center text-slate-500">Loading services...</p>
      ) : (
        <AdminTable
          data={services}
          columns={["id", "name", "description"]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminServices;