/**
 * @desc user resets their password
 *      - takes in a generated crypto token as url parameter
 * @returns reset password page
 */

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";
import { useAuthHook } from "../hooks/authHooks";
import toast from "react-hot-toast";
import ButtonLoader from "../components/commonUI/ButtonLoader";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // get the reset token from the url
  const { resetPassword } = useAuthHook();
  const [error, setError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const payload = { token, password, confirmPassword };

  // submit data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await resetPassword(payload);
      toast.success(response.message || "Password Reset Successful");
      navigate("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Password Reset"
        subtitle={"Enter your new password"}
        error={error}
      >
        {/**-------- form ---------- */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="************"
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="retype password"
            />

            {/** Submitting Button */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <ButtonLoader text="Submitting..." />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/** link to registration page */}
          <p className="text-center mt-8 text-sm">
            Remember password?{" "}
            <Link
              to="/auth/login"
              className="text-accent hover:underline transition-colors duration-500"
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
