/**
 * @desc user resets their password
 *      - takes in a generated crypto token as url parameter
 * @returns reset password page
 */

import { Link } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";
import { useState } from "react";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <AuthLayout>
      <FormWrapper title="Password Reset" subtitle={"Enter your new password"}>
        {/**-------- form ---------- */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="************"
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="retype password"
            />

            <Button type="submit"> Reset Password </Button>
          </form>

          {/** link to registration page */}
          <p className="text-center mt-8 text-sm">
            Remember password?{" "}
            <Link
              to="/auth/login"
              className="text-secondary hover:text-[var(--accent)] transition-colors duration-500"
            >
              {" "}
              Sign In
            </Link>
          </p>
        </div>
      </FormWrapper>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
