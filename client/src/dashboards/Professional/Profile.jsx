import { useState } from "react";
import useProfile from "../../hooks/useProfile";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Settings, Upload } from "lucide-react";

const ProfilePro = () => {
  const { user, loading, updateProfile } = useProfile("professional");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    role: user?.role || "professional",
    profile_picture: user?.profile_picture || "",
  });

  const [dragActive, setDragActive] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-8 border-orange-200 border-t-orange-500"
        />
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setEditing(false);
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profile_picture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 p-8 lg:p-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header Banner */}
        <div className="h-40 bg-gradient-to-r from-orange-400 to-rose-400 relative">
          <div className="absolute -bottom-12 left-8 flex items-center gap-6">
            {formData.profile_picture ? (
              <img
                src={formData.profile_picture}
                alt={formData.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl border-4 border-white shadow-lg">
                {formData.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">{formData.name}</h1>
              <p className="text-slate-500 font-medium">{formData.role?.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        {editing && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`mt-16 mx-8 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${
              dragActive ? "border-orange-500 bg-orange-50" : "border-slate-300"
            }`}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <Upload size={32} className="text-orange-500 mb-2" />
            <p className="text-slate-600 font-medium">
              Drag & drop your profile picture here, or click to upload
            </p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) handleFileUpload(e.target.files[0]);
              }}
            />
          </div>
        )}

        {/* Profile Content */}
        <div className="pt-20 pb-10 px-8 space-y-6">
          <ProfileRow
            icon={<User size={20} />}
            label="Name"
            value={formData.name}
            editable={editing}
            onChange={(val) => handleChange("name", val)}
          />
          <ProfileRow
            icon={<Mail size={20} />}
            label="Email"
            value={formData.email}
            editable={editing}
            onChange={(val) => handleChange("email", val)}
          />
          <ProfileRow
            icon={<Phone size={20} />}
            label="Phone"
            value={formData.phone}
            editable={editing}
            onChange={(val) => handleChange("phone", val)}
          />
          <ProfileRow
            icon={<MapPin size={20} />}
            label="Location"
            value={formData.location}
            editable={editing}
            onChange={(val) => handleChange("location", val)}
          />
          <ProfileRow
            icon={<Settings size={20} />}
            label="Role"
            value={formData.role}
            editable={false} // role is fixed, not editable
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ---------------- Profile Row Component ---------------- */
const ProfileRow = ({ icon, label, value, editable, onChange }) => (
  <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
    <div className="text-orange-500">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-slate-500">{label}</p>
      {editable ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded-lg p-2 mt-1"
        />
      ) : (
        <p className="font-semibold text-slate-800">{value}</p>
      )}
    </div>
  </div>
);

export default ProfilePro;
