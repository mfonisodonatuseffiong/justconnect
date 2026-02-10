export default function AdminNavbar() {
    return (
      <header className="bg-white shadow-md border-b border-orange-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-600">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/admin/login";
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Logout
        </button>
      </header>
    );
  }
  