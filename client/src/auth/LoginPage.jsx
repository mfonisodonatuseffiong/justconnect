/**
 * @description login page
 */

import { Link } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";

const LoginPage = () => {
  return (
    <AuthLayout>
      <FormWrapper
        title="Welcome Back"
        subtitle="Fill in your credentials to gain access"
      >
        {/**-------- form ---------- */}
        <div>
          <form className="space-y-2">
            <Input label="Email" type="email" placeholder="example@gmail.com" />
            <Input
              label="Password"
              type="password"
              placeholder="************"
            />
            <p>
              <Link
                to="/auth/forget-password"
                className="text-gray-400 hover:text-orange-500 transition-colors duration-500"
              >
                Forget password?
              </Link>
            </p>
            <Button type="button"> Login </Button>
          </form>

          {/** link to registration page */}
          <p className="text-center mt-8">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-gray-400 hover:text-orange-500 transition-colors duration-500"
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
