/**
 * @description login page
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Welcome Back"
        subtitle="Fill in your credentials to gain access"
      >
        {/**-------- form ---------- */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              name="password"
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
              {" "}
              Create new account
            </Link>
          </p>
        </div>
      </FormWrapper>
    </AuthLayout>
  );
};

export default LoginPage;
