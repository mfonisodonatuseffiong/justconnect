/**
 * @description registration page with reuseable components, like, wrapper, form, pagelayout, button and input
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormWrapper from "../components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";
import ButtonLoader from "../components/commonUI/ButtonLoader";
import toast from "react-hot-toast";
import { useAuthHook } from "../hooks/authHooks";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthHook();
  const [error, setError] = useState(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
    isChecked: false,
  });

  /** get values */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  /** submit form function */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingAccount(true); // loading state
    try {
      const response = await register(formData);
      toast.success(response.message || "Account created successfully.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Create New Account"
        subtitle="Get a new account in seconds. "
        error={error}
      >
        {/**-------- form ---------- */}
        <>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <Input
                label="Name"
                type="name"
                value={formData.name}
                onChange={handleChange}
                name="name"
                autoComplete="username"
                placeholder="Full Name"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  autoComplete="username"
                  placeholder="example@gmail.com"
                />
                <div className="w-full">
                  <p className="text-sm mb-2"> Role:</p>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="bg-gray-50 focus:outline-none rounded-md text-primary-gray text-sm md:text-md p-3 w-full"
                  >
                    <option value=""> -- select role --</option>
                    <option value="professional">Professional</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              {/** ======== password =============== */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Create password"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Retype password"
                />
              </div>
              {/** ====== Agree to terms and policies ======= */}
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={formData.isChecked}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      isChecked: e.target.checked,
                    });
                  }}
                  className="accent-brand"
                />{" "}
                <Link
                  to="/terms"
                  className="hover:underline text-sm text-secondary"
                >
                  I agree to terms and policies
                </Link>
              </div>
              {/** Sign up Button */}
              <Button type="submit" disabled={isCreatingAccount}>
                {isCreatingAccount ? (
                  <ButtonLoader text="Creating Account..." />
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center mt-4 text-sm">
                I have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-accent hover:underline transition-colors duration-500"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </>
      </FormWrapper>
    </AuthLayout>
  );
};

export default RegistrationPage;
