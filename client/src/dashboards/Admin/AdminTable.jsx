// src/dashboards/Admin/AdminTable.jsx
const AdminTable = ({ data, columns, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-2xl shadow-md border border-orange-100">
        <thead>
          <tr className="bg-orange-50 text-slate-700 font-semibold">
            {columns.map((col) => (
              <th key={col} className="px-6 py-3 text-left capitalize">
                {col.replace("_", " ")}
              </th>
            ))}
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t border-orange-100 hover:bg-orange-50 transition">
              {columns.map((col) => (
                <td key={col} className="px-6 py-4 text-slate-600">
                  {item[col] || "N/A"}
                </td>
              ))}
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => onEdit(item.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
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
  );
};

export default AdminTable;