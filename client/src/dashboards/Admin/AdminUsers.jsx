// src/dashboards/Admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import authAxios from "../../api";
import AdminTable from "./AdminTable";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAxios.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await authAxios.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleEdit = (id) => {
    console.log("Edit user", id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-orange-600 mb-8">Users Management</h1>
      {loading ? (
        <p className="text-center text-slate-500">Loading users...</p>
      ) : (
        <AdminTable
          data={users}
          columns={["id", "name", "email", "role", "created_at"]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminUsers;