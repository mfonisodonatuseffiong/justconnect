import { Link } from "react-router-dom";

const UserAsideBar = ({ user }) => {
  return (
    <aside className="w-64 bg-gray-200 p-4 flex flex-col gap-2">
      <Link to="/user-dashboard" className="hover:underline">
        My Dashboard
      </Link>
      <Link to="/profile" className="hover:underline">
        Profile
      </Link>
      <Link to="/settings" className="hover:underline">
        Settings
      </Link>
    </aside>
  );
};

export default UserAsideBar;
