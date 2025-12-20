// src/dashboards/User/ProfilePage.jsx
import { useAuthHook } from "../../hooks/authHooks";

const ProfilePage = () => {
  const { user } = useAuthHook();

  if (!user) return <p>No user profile loaded</p>;

  return (
    <div className="bg-black/70 rounded-xl p-6">
      <h2 className="text-xl font-bold text-accent mb-4">Profile</h2>
      <p className="text-white">Name: {user.name}</p>
      <p className="text-gray-400">Email: {user.email}</p>
      <p className="text-gray-400">Role: {user.role}</p>
    </div>
  );
};

export default ProfilePage;
