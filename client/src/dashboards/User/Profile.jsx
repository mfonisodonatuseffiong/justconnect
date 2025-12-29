import { motion } from "framer-motion";

const Profile = () => {
  return (
    <div className="bg-orange-50 min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto bg-white border border-orange-200 rounded-2xl shadow-md p-6"
      >
        <h1 className="text-2xl font-bold text-orange-600 mb-6">
          Profile
        </h1>

        <div className="space-y-4 text-slate-700">
          <div className="flex justify-between">
            <span className="font-semibold text-orange-500">Name</span>
            <span>Sam Lagos</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-orange-500">Email</span>
            <span>samlagos@example.com</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-orange-500">Role</span>
            <span className="capitalize">User</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
