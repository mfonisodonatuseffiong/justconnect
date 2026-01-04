// src/dashboards/User/ProfilePage.jsx
/**
 * @description Compact & Elegant User Profile Card
 *              Industry-standard small card design with fade animations
 */

import { useState, useEffect } from "react";
import { useAuthHook } from "../../hooks/authHooks";
import { useAuthStore } from "../../store/authStore";
import authAxios from "../../api";
import {
  User,
  Mail,
  Shield,
  MapPin,
  Phone,
  Calendar,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { user } = useAuthHook();
  const { setUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (user?.profile_picture) {
      const path = user.profile_picture.startsWith("http")
        ? user.profile_picture
        : `http://localhost:5000${user.profile_picture}`;
      setPreviewUrl(path);
    } else {
      setPreviewUrl("");
    }
  }, [user?.profile_picture]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const res = await authAxios.post("/upload/profile", formData);
      const newPicturePath = res.data.profile_picture;

      setUser({ ...user, profile_picture: newPicturePath });

      const fullUrl = newPicturePath.startsWith("http")
        ? newPicturePath
        : `http://localhost:5000${newPicturePath}`;
      setPreviewUrl(fullUrl);

      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image. Please try again.");
      setPreviewUrl(user?.profile_picture ? `http://localhost:5000${user.profile_picture}` : "");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload({ target: { files: [file] } });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-8 border-orange-200 border-t-orange-500"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-rose-50 p-6 lg:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Compact Profile Card with Fade-In */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-200"
        >
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-10 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-2xl"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/30 flex items-center justify-center">
                      <User size={80} className="text-white/70" />
                    </div>
                  )}
                </motion.div>

                <label
                  htmlFor="profile-upload"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                  {uploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Upload size={32} className="text-white mb-2" />
                      <span className="text-sm font-medium">Upload Photo</span>
                    </>
                  )}
                </label>

                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              <div className="text-center sm:text-left">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-extrabold"
                >
                  {user.name || "User"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 text-xl opacity-90 capitalize"
                >
                  {user.role || "Customer"}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-4 text-lg opacity-80 flex items-center justify-center sm:justify-start gap-2"
                >
                  <Calendar size={20} />
                  Member since{" "}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : "Recently"}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-10 space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <DetailItem icon={Mail} label="Email Address" value={user.email} />
              {user.phone && <DetailItem icon={Phone} label="Phone Number" value={user.phone} />}
              {user.location && <DetailItem icon={MapPin} label="Location" value={user.location} />}
              <DetailItem icon={Shield} label="Account Type" value={user.role || "Customer"} />
            </div>

            <div className="pt-8 border-t-2 border-orange-100 text-center">
              <p className="text-slate-600">
                Drag and drop or click the photo to upload a new profile picture
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Recommended: Square image • Max 5MB
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Detail Item with subtle hover animation
const DetailItem = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -4 }}
    className="flex items-center gap-5 p-5 bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl shadow-inner border border-orange-100"
  >
    <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center">
      <Icon size={28} className="text-orange-600" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-800 capitalize">{value}</p>
    </div>
  </motion.div>
);

export default ProfilePage;