import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import FormWrapper from "../../components/FormWrapper";
import Input from "../../components/commonUI/Input";
import authAxios from "../../api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Use the same endpoint that worked in curl
      const res = await authAxios.post("/api/v1/auth/login", formData);
      const { accessToken, refreshToken, user, message } = res.data || {};

      if (!accessToken || !user) {
        throw new Error("Invalid login response");
      }

      // ✅ Store consistently
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(message || "Login successful!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      console.error("❌ Admin login failed:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Welcome Back"
        subtitle="Sign in to continue"
        error={error}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="************"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="text-right">
            <Link
              to="/auth/forget-password"
              className="text-orange-500 hover:text-orange-600 text-sm font-medium transition"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl px-6 py-3 text-base font-semibold tracking-wide
                       transition-all duration-200 shadow-md border
                       bg-orange-500 border-orange-500 text-white
                       hover:bg-orange-600 hover:border-orange-600 active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </FormWrapper>
    </AuthLayout>
  );
}
