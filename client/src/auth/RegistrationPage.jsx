/**
 * @description registration page with reuseable components, like, wrapper, form, pagelayout, button and input
 */

import { useState } from "react";
import { AnimatePresence, easeOut, motion as Motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";
import ButtonLoader from "../components/commonUI/ButtonLoader";
import { ChevronsRight, ChevronsLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthHook } from "../hooks/authHooks";
import { useAuthStore } from "../store/authStore";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { setError } = useAuthStore();
  const { RegisterHook, error } = useAuthHook();
  const [nextScreen, setNextScreen] = useState(false);

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
  };

  /** lock next button */
  const isNextDisabled = !formData.name || !formData.email || !formData.role;

  /** function to handle screen switch */
  const switchScreen = () => {
    if (!formData.name || !formData.email || !formData.role) {
      setError("Please fill in all fields before continuing");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    setNextScreen((prev) => !prev);
    setError("");
  };

  /** submit form function */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingAccount(true); // loading state
    try {
      const responseMessage = await RegisterHook(formData);
      toast.success(responseMessage);
      navigate("/auth/login");
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Create New Account"
        subtitle="Get a new account in seconds be it client / professional"
        error={error}
      >
        {/**-------- form ---------- */}
        <div>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!nextScreen && (
                <Motion.div
                  key="first" // 🔑 unique key
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.1, ease: easeOut }}
                  className="space-y-4"
                >
                  <Input
                    label="Name"
                    type="name"
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    autoComplete="username"
                    placeholder="Full Name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    autoComplete="username"
                    placeholder="example@gmail.com"
                  />

                  <div className="block space-y-1">
                    <p className="text-sm">Role</p>
                    <select
                      value={formData.role}
                      name="role"
                      onChange={handleChange}
                      className="cursor-pointer focus:outline-none w-full bg-gray-50 text-primary-gray p-4 leading-tight rounded-full"
                    >
                      <option value=""> ---- Select a Role ---- </option>
                      <option value="professional"> Professional</option>
                      <option value="client"> Client</option>
                    </select>
                  </div>
                  {/** next page button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      disabled={isNextDisabled}
                      onClick={switchScreen}
                      className={`p-4 float-right rounded-2xl shadow-2xl transition-colors duration-300 ${
                        isNextDisabled
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-brand text-white hover:text-accent cursor-pointer"
                      }`}
                    >
                      <ChevronsRight className="size-4" />
                    </button>
                  </div>
                </Motion.div>
              )}

              {nextScreen && (
                <Motion.div
                  key="second" // 🔑 unique key
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.1, ease: easeOut }}
                  className="space-y-4"
                >
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
                    placeholder="retype password"
                  />
                  {/** agree to terms and policies */}
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
                      {" "}
                      I agree to terms and policies
                    </Link>
                  </div>
                  {/** Sign up Button */}
                  <Button type="submit" disabled={isCreatingAccount}>
                    {" "}
                    {isCreatingAccount ? (
                      <ButtonLoader text="Creating Account..." />
                    ) : (
                      "Create Account"
                    )}{" "}
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

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={switchScreen}
                      className="bg-brand text-white hover:text-accent p-4 float-right rounded-2xl shadow-2xl cursor-pointer transition-colors duration-300"
                    >
                      <ChevronsLeft className="size-4" />
                    </button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </FormWrapper>
    </AuthLayout>
  );
};

export default RegistrationPage;
