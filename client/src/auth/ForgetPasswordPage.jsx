/**
 * @desc returns the forget password page
 *  @return    - gets user email and send a one time reset link to the client
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";
import ButtonLoader from "../components/commonUI/ButtonLoader";
import { useAuthHook } from "../hooks/authHooks";
import toast from "react-hot-toast";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { forgetPassword } = useAuthHook();

  // Handle form submission logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Gets direct backend message
    try {
      const response = await forgetPassword({ email });
      toast.success(
        response.message || "Reset mail successfully sent to your email.",
      );
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Account Recovery"
        subtitle="Let's have your registered email"
        error={error}
      >
        {/**-------- form ---------- */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Email"
              type="email"
              value={email}
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="example@gmail.com"
            />
            {/** submit button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <ButtonLoader text="Verifying ..." />
              ) : (
                "Recover Account"
              )}
            </Button>
          </form>

          {/** link to registration page */}
          <p className="text-center mt-8 text-sm">
            Remember password?
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
export default ForgetPasswordPage;
