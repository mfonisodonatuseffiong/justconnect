import { useEffect, useState } from "react";
import { getProfessionalsAdmin, deleteProfessional } from "./adminService";

export default function Professionals() {
  const [pros, setPros] = useState([]);

  useEffect(() => {
    const fetchPros = async () => {
      const res = await getProfessionalsAdmin();
      setPros(res);
    };
    fetchPros();
  }, []);

  const handleDelete = async (id) => {
    await deleteProfessional(id);
    setPros(pros.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Professionals</h2>
      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-orange-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Service</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pros.map((pro) => (
            <tr key={pro.id} className="border-b">
              <td className="p-3">{pro.name}</td>
              <td className="p-3">{pro.service}</td>
              <td className="p-3">{pro.location}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(pro.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
