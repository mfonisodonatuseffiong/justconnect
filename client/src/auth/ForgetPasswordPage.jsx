/**
 * @desc returns the forget password page
 *  @return    - gets user email and send a one time reset link to the client
 */

import { Link } from "react-router-dom";
import AuthLayout from "./components/authLayout";
import FormWrapper from "./components/FormWrapper";
import Input from "../components/commonUI/Input";
import Button from "../components/commonUI/Button";

const ForgetPasswordPage = () => {
  return <AuthLayout>
    <FormWrapper
      title="Account Recovery"
      subtitle="Let's have your registered email"
    >
      {/**-------- form ---------- */}
      <div>
        <form className="space-y-4">
          <Input label="Email" type="email" placeholder="example@gmail.com" />
          <Button type="button"> Recover Account </Button>
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
  </AuthLayout>;
};
export default ForgetPasswordPage;
