import useProfile from "../../hooks/useProfile";

const ProfilePro = () => {
  const { user, loading, updateProfile } = useProfile("professional");

  if (loading) return <p>Loading profile...</p>;

  const handleUpdate = () => {
    updateProfile({ businessName: "Updated Business" });
  };

  return (
    <div>
      <h1>My Profile</h1>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
};

export default ProfilePro;
