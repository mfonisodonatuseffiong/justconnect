// src/dashboards/User/ProfilePage.jsx
import { useState, useEffect } from "react";
import { useAuthHook } from "../../hooks/authHooks";
import { useAuthStore } from "../../store/authStore";
import authAxios from "../../api";
import { User, Mail, Shield, MapPin, Phone, Calendar, Upload } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Backend base URL for images
const BACKEND_URL = "http://localhost:5000";

const ProfilePage = () => {
  const { user } = useAuthHook();
  const { setUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  /**
   * ✅ FIX:
   * React effect must react to profile_picture changes
   * Dependency array MUST stay consistent
   */
  useEffect(() => {
    if (user?.profile_picture) {
      setPreviewUrl(`${BACKEND_URL}${user.profile_picture}`);
    } else {
      setPreviewUrl("");
    }
  }, [user?.profile_picture]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Immediate local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const res = await authAxios.post("/upload/profile", formData);

      const newPicturePath = res.data.profile_picture;

      // ✅ Update auth store
      setUser({ ...user, profile_picture: newPicturePath });

      toast.success("Profile picture updated successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Failed to upload image. Please try again.");
      setPreviewUrl(
        user?.profile_picture ? `${BACKEND_URL}${user.profile_picture}` : ""
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-xl text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-rose-50 p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800">
          My Profile
        </h1>
        <p className="mt-4 text-xl text-slate-600">
          Update your photo and view your account details
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto bg-white/90 backdrop-blur-lg border-2 border-orange-200 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-10 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-2xl">
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
              </div>

              <label
                htmlFor="profile-upload"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
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
              <h2 className="text-3xl lg:text-4xl font-extrabold">
                {user.name || "User"}
              </h2>
              <p className="mt-2 text-xl opacity-90 capitalize">
                {user.role || "Customer"}
              </p>
              <p className="mt-3 text-sm opacity-80 flex items-center gap-2">
                <Calendar size={18} />
                Member since{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })
                  : "Recently"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Info label="Email Address" value={user.email} icon={Mail} />
            {user.phone && <Info label="Phone Number" value={user.phone} icon={Phone} />}
            {user.location && <Info label="Location" value={user.location} icon={MapPin} />}
            <Info label="Account Type" value={user.role} icon={Shield} />
          </div>

          <div className="pt-8 border-t-2 border-orange-100 text-center">
            <p className="text-slate-600">
              Drag and drop or click the photo to upload a new profile picture
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Recommended: Square image, max 5MB
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Info = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shadow-md">
      <Icon size={24} className="text-orange-600" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-800 capitalize">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
