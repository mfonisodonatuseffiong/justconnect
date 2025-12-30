import { motion } from "framer-motion";
import { User, Mail, Shield, MapPin, Phone, Calendar } from "lucide-react";

const Profile = () => {
  // Mock user data (replace with real user from store in actual app)
  const user = {
    name: "Sam Lagos",
    email: "samlagos@example.com",
    role: "user",
    phone: "+234 801 234 5678",
    location: "Lagos, Nigeria",
    joinedDate: "January 2025",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-rose-50 p-6 lg:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800">
          My Profile
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          Your personal details and account overview
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="
          max-w-2xl mx-auto
          bg-white/90 backdrop-blur-lg
          border-2 border-orange-200
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl border-4 border-white">
                <User size={64} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400/40 to-rose-400/40 blur-xl scale-110 -z-10" />
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h2 className="text-3xl lg:text-4xl font-extrabold">{user.name}</h2>
              <p className="mt-2 text-lg opacity-90 capitalize">{user.role}</p>
              <p className="mt-1 text-sm opacity-80 flex items-center justify-center sm:justify-start gap-2">
                <Calendar size={16} />
                Joined {user.joinedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shadow-md">
                <Mail size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="text-lg font-semibold text-slate-800">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shadow-md">
                <Phone size={24} className="text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone Number</p>
                <p className="text-lg font-semibold text-slate-800">{user.phone}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shadow-md">
                <MapPin size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Location</p>
                <p className="text-lg font-semibold text-slate-800">{user.location}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center shadow-md">
                <Shield size={24} className="text-rose-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Account Type</p>
                <p className="text-lg font-semibold text-slate-800 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-8 border-t-2 border-orange-100 text-center">
            <p className="text-slate-600 italic">
              You're part of a growing community connecting with trusted professionals every day.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;