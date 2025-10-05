/**
 * @desc returns the forget password page
 *  @return    - gets user email and send a one time reset link to the client
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <AuthLayout>
      <FormWrapper
        title="Account Recovery"
        subtitle="Let's have your registered email"
      >
        {/**-------- form ---------- */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Email"
              type="email"
              value={email}
              name="email"
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
            <Button type="submit"> Recover Account </Button>
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
export default ForgetPasswordPage;
