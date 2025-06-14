import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/form/FormInput.jsx";
import { useLogin } from "../../hooks/useLogin.jsx";
import FormButton from "../../components/form/FormButton.jsx";
import LogoHeader from "../../components/form/LogoHeader.jsx";

const Login = () => {
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = useLogin({ setUser, navigate, setLoading });

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-md mx-auto w-screen mt-4 p-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl self-center font-sans dark:text-gray-100 font-medium">
            Sign in to CollabBoard
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <FormInput
            label="Username or Email"
            name="usernameOrEmail"
            register={register}
            rules={{ required: "Username or Email required" }}
            error={errors.usernameOrEmail}
          />
          <FormInput
            label="Password"
            name="password"
            register={register}
            rules={{ required: "Please provide your password" }}
            error={errors.password}
          />
          <FormButton
            loading={loading}
            text="Log in"
            loadingText="Logging in..."
          />
        </form>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-6 text-sm">
          No account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
