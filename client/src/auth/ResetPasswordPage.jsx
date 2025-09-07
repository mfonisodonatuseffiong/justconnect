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

const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <FormWrapper title="Password Reset">
        {/**-------- form ---------- */}
        <div>
          <form className="space-y-4">
            <Input
              label="Password"
              type="password"
              placeholder="************"
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="retype password"
            />

            <Button type="button"> Reset Password </Button>
          </form>

          {/** link to registration page */}
          <p className="text-center mt-8">
            Remember password?{" "}
            <Link
              to="/auth/login"
              className="text-gray-400 hover:text-orange-500 transition-colors duration-500"
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
