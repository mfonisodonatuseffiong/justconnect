import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../components/AuthLayout";
import FormWrapper from "../components/FormWrapper";
import Input from "../components/commonUI/Input"; // ✅ now safe to use
import Button from "../components/commonUI/Button";
import ButtonLoader from "../components/commonUI/ButtonLoader";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuthStore();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    console.log("🚀 Sending login payload:", formData);

    try {
      const response = await auth.login(formData);
      console.log("✅ Login response:", response);

      const { user, accessToken, refreshToken, message } = response || {};

      if (!user || !accessToken) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(message || "Login successful");

      if (user.role === "professional") {
        navigate("/professional-dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/user-dashboard", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("💥 Login failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
      console.log("🔄 Login process finished");
    }
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Welcome Back"
        subtitle="Sign in to continue"
        error={error}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 px-2 sm:px-0">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@justconnect.com"
            autoComplete="username"
            required
            className="w-full text-sm sm:text-base"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Admin123!"
            autoComplete="current-password"
            required
            className="w-full text-sm sm:text-base"
          />

          <div className="text-right">
            <Link
              to="/auth/forget-password"
              className="text-orange-500 hover:text-orange-600 text-xs sm:text-sm font-medium transition"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2 sm:py-3 text-sm sm:text-base"
          >
            {isLoggingIn ? <ButtonLoader text="Logging in..." /> : "Login"}
          </Button>
        </form>

        <p className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-slate-600">
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
};

export default LoginPage;
