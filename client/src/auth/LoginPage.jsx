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
      // Call login from your auth hook
      const response = await login(formData);

      // Expecting backend to return { user, accessToken }
      const user = response?.user;
      const token = response?.accessToken;

      if (!user || !token) {
        throw new Error("Login failed: invalid server response");
      }

      // Persist token for authAxios
      localStorage.setItem("accessToken", token);

      toast.success(response?.message || "Login successful");

      // Redirect based on role
      if (user.role === "professional") {
        navigate("/professional-dashboard", { replace: true });
      } else if (user.role === "user") {
        navigate("/user-dashboard", { replace: true });
      } else {
        console.warn("Unknown role:", user.role);
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = err?.response?.data?.message || err?.message || "Login failed";
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
        subtitle="Fill in your credentials to gain access"
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

          <p>
            <Link
              to="/auth/forget-password"
              className="text-secondary hover:text-brand hover:underline transition-colors duration-500"
            >
              Forget password?
            </Link>
          </p>

          <Button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? <ButtonLoader text="Logging in..." /> : "Login"}
          </Button>
        </form>

        <p className="text-center mt-8 text-sm">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-accent hover:underline transition-colors duration-500"
          >
            Create new account
          </Link>
        </p>
      </FormWrapper>
    </AuthLayout>
  );
};

export default LoginPage;
