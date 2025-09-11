/**
 * @description:  - Login page
 *                - Uses the login Hook to send request to backend
 *                - displays a static error message at the top of the form div, passing the error message into the error props in the form wrapper
 *                - If Successful login, display a success message via hot toast and navigate user to dashboard
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";

import { useAuthHook } from "../hooks/authHooks";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { LoginHook, error } = useAuthHook();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic
    try {
      const user = await LoginHook(formData);
      console.log("Logged in user:", user);
      toast.success(user?.message || "Login successful");
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Welcome Back"
        subtitle="Fill in your credentials to gain access"
        error={error}
      >
        {/**-------- form ---------- */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              name="email"
              autoComplete="username"
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              name="password"
              autoComplete="current-password"
              onChange={handleChange}
              placeholder="************"
            />
            <p>
              <Link
                to="/auth/forget-password"
                className="text-[var(--secondary)] hover:text-orange-500 transition-colors duration-500"
              >
                Forget password?
              </Link>
            </p>
            <Button type="submit"> Login </Button>
          </form>

          {/** link to registration page */}
          <p className="text-center mt-8 text-sm">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-[var(--secondary)] hover:text-[var(--accent)] transition-colors duration-500"
            >
              Create new account
            </Link>
          </p>
        </div>
      </FormWrapper>
    </AuthLayout>
  );
};

export default LoginPage;
