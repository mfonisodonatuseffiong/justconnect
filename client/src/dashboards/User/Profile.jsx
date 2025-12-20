import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import authAxios from "../../api";

const Profile = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await authAxios.get(`/users/${user.id}`);
      setProfile(res.data.profile);
    };
    fetchProfile();
  }, [user.id]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Location:</strong> {profile.location || "N/A"}</p>
      <p><strong>Contact:</strong> {profile.contact || "N/A"}</p>
      <img src={profile.profile_pic} alt="Profile" className="w-32 h-32 rounded-full mt-4" />
    </div>
  );
};

export default Profile;
