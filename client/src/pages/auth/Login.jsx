import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/Form/FormInput.jsx";
import { useLogin } from "../../hooks/useLogin.jsx";
import FormButton from "../../components/Form/FormButton.jsx";

const Login = () => {
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = useLogin({
    setUser,
    setError,

    navigate,
    setLoading,
  });

  return (
    <div className="min-h-screen pt-20 px-4 overflow-hidden flex items-center justify-center">
      <div className="max-w-md w-full mt-4 p-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl self-center font-sans dark:text-gray-100 font-medium">
            Sign in to CollabBoard
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            handleSubmit(onSubmit)(e);
          }}
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
            type="password"
            rules={{
              required: "Please provide your password",
              minLength: {
                value: 4,
                message: "Minimum password lenght should be 4",
              },
            }}
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
