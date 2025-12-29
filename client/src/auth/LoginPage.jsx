import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";
import ButtonLoader from "../components/commonUI/ButtonLoader";
import { useAuthHook } from "../hooks/authHooks";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthHook();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /** Handle input changes */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  /** Handle login submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await login(formData);

      const user = response?.user;
      const token = response?.accessToken;

      if (!user || !token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("accessToken", token);

      toast.success(response?.message || "Login successful");

      if (user.role === "professional") {
        navigate("/professional-dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/user-dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
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
            value={formData.email}
            autoComplete="username"
            onChange={handleChange}
            placeholder="example@gmail.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            autoComplete="current-password"
            onChange={handleChange}
            placeholder="************"
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

          <Button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <ButtonLoader text="Logging in..." />
            ) : (
              "Login"
            )}
          </Button>
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
};

export default LoginPage;
