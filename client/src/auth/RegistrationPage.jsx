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
import { ChevronsRight, ChevronsLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthHook } from "../hooks/authHooks";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { RegisterHook, error } = useAuthHook();
  const [nextScreen, setNextScreen] = useState(false);

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

  /** function to handle screen switch */
  const switchScreen = () => {
    setNextScreen((prev) => !prev);
  };

  /** submit form function */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await RegisterHook(formData);
      toast.success(response?.message || "Account created Successfully");
      navigate("/auth/login");
    } catch (error) {
      console.error(error.message);
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
                      className="cursor-pointer focus:outline-none w-full bg-gray-200 text-gray-700 py-3 px-4 leading-tight rounded-full"
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
                      onClick={switchScreen}
                      className="bg-[var(--accent)] hover:bg-orange-600 p-4 float-right rounded-2xl shadow-2xl cursor-pointer transition-colors duration-300"
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
                      className="accent-[var(--accent)]"
                    />{" "}
                    <Link
                      to="/terms-&-policies"
                      className="hover:underline text-sm text-secondary"
                    >
                      {" "}
                      I agree to terms and policies
                    </Link>
                  </div>

                  <Button type="submit"> Create Account </Button>

                  <p className="text-center mt-4 text-sm">
                    I have an account?{" "}
                    <Link
                      to="/auth/login"
                      className="text-[var(--secondary)] hover:text-[var(--accent)] hover:underline transition-colors duration-500"
                    >
                      Login
                    </Link>
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={switchScreen}
                      className="bg-[var(--accent)] hover:bg-orange-600 p-4 float-right rounded-2xl shadow-2xl cursor-pointer transition-colors duration-300"
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
