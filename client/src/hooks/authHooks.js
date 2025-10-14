/**
 * @description Custom hook for authentication state management using Zustand.
 * This hook provides access to the authentication store defined in authStore.js.
 * It allows components to easily access and manipulate authentication state.
 *
 */

import { useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import {
  loginSchema,
  registerSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../validation/authValidation";
import {
  loginService,
  registerService,
  forgetPasswordService,
  resetPasswordService,
  CheckMeService,
} from "../service/authService";

export const useAuthHook = () => {
  const { setUser, setIsCheckingMe, clearUser, error, setError } =
    useAuthStore();

  // check user authentication status
  const checkMeHook = useCallback(async () => {
    setIsCheckingMe(true);
    try {
      const data = await CheckMeService();
      setUser(data.user);
      console.log("current user:", data.user);
    } catch (error) {
      console.error("checkMe Error:", error.message);
      clearUser();
    } finally {
      setIsCheckingMe(false);
    }
  }, [clearUser, setIsCheckingMe, setUser]);

  // handle login
  const LoginHook = async (formData) => {
    // validate formData and perform login logic here
    const { error: validationError } = loginSchema.validate(formData);
    if (validationError) {
      const msg = validationError.details[0].message;
      setError(msg);
      throw new Error(msg);
    }
    // call the login service
    setError(null); // Clear previous errors
    try {
      const data = await loginService(formData);
      setUser(data.user);
      setError(null);
      return data;
    } catch (error) {
      console.error("Error in login hook", error.message);
      setError(error.message);
      throw error;
    }
  };

  // registration logic
  const RegisterHook = async (formData) => {
    // validate form data
    const { error: validationError } = registerSchema.validate(formData);
    if (validationError) {
      const errorMsg = validationError.details[0].message;
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    // if form is valid, send it to backend
    setError(null); // Clear previous errors
    const { name, email, role, password } = formData;
    const payload = { name, email, role, password };
    try {
      const data = await registerService(payload);
      return data?.message || "Account created successfully";
    } catch (error) {
      setError(error.message);
      console.error("Error in register hook", error.message);
      throw error;
    }
  };

  // forget password logic
  const ForgetPasswordHook = async ({ email }) => {
    const { error: validationError } = forgetPasswordSchema.validate({ email });
    if (validationError) {
      const errMsg = validationError.details[0].message;
      setError(errMsg);
      throw new Error(errMsg);
    }
    // clear previous error
    setError(null);
    try {
      const data = await forgetPasswordService({ email });
      return data.message;
    } catch (error) {
      setError(error.message);
      console.error("Error in register hook", error.message);
      throw error;
    }
  };

  // Reset password logic
  const ResetPasswordHook = async ({ password, confirmPassword, token }) => {
    const { error: validationError } = resetPasswordSchema.validate({
      password,
      confirmPassword,
    });
    if (validationError) {
      const errMsg = validationError.details[0].message;
      setError(errMsg);
      throw new Error(errMsg);
    }
    // clear previous error
    setError(null);
    const payload = { password, token };
    try {
      const data = await resetPasswordService(payload);
      return data.message;
    } catch (error) {
      setError(error.message);
      console.error("Error in register hook", error.message);
      throw error;
    }
  };

  return {
    error,
    LoginHook,
    RegisterHook,
    ForgetPasswordHook,
    ResetPasswordHook,
    checkMeHook,
  };
};
