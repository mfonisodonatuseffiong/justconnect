/**
 * @description registration page with reuseable components, like, wrapper, form, pagelayout, button and input
 */

import { Link } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";

const RegistrationPage = () => {
  return (
    <AuthLayout>
      <FormWrapper
        title="Create New Account"
        subtitle="Get a new account in seconds be it client / professional"
      >
        {/**-------- form ---------- */}
        <div>
          <form className="space-y-2">
            <Input label="Name" type="name" placeholder="John Doe" />
            <Input label="Email" type="email" placeholder="example@gmail.com" />

            {/** role drop down */}
            <div className="block space-y-1">
              <p className="text-sm">Role</p>
              <select className="cursor-pointer focus:outline-none w-full bg-gray-200 text-gray-600 py-3 px-4 leading-tight rounded-full">
                <option value=""> ---- Select a Role ---- </option>
                <option value="professional"> Professional</option>
                <option value="client"> Client</option>
              </select>
            </div>
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

            {/** Terms and Policies */}
            <div className="space-x-3">
              <input type="checkbox" className="accent-purple-200" />
              <label className="text-gray-400 text-sm">
                I Accept terms & policies
              </label>
            </div>

            <Button type="button"> Create Account </Button>
          </form>

          {/** link to registration page */}
          <p className="text-center mt-8">
            I have an account?{" "}
            <Link
              to="/auth/login"
              className="text-gray-400 hover:text-orange-500 transition-colors duration-500"
            >
              {" "}
              Login
            </Link>
          </p>
        </div>
      </FormWrapper>
    </AuthLayout>
  );
};

export default RegistrationPage;
