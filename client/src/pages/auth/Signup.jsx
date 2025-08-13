import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/Form/FormInput.jsx";
import { useSignup } from "../../hooks/useSignup.jsx";

import LogoHeader from "../../components/Form/LogoHeader.jsx";
import FormButton from "../../components/Form/FormButton.jsx";

const Signup = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = useSignup({ setError, navigate, setLoading });

  return (
    <div className="min-h-screen pt-20 px-4">
      <LogoHeader />
      <div className="max-w-md mx-auto w-screen mt-4 p-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl self-center font-sans dark:text-gray-100 font-medium">
            Welcome to CollabBoard
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <FormInput
            label="Username"
            name="username"
            register={register}
            rules={{ required: "Please provide your username" }}
            error={errors.username}
          />
          <FormInput
            label="FullName"
            name="fullName"
            register={register}
            rules={{ required: "Please provide your fullname" }}
            error={errors.fullName}
          />
          <FormInput
            label="Email"
            name="email"
            register={register}
            rules={{
              required: "Please provide your email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }}
            error={errors.email}
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            register={register}
            rules={{ required: "Please provide your password" }}
            error={errors.password}
          />
          <FormButton
            loading={loading}
            text="Sign up"
            loadingText="Signing up..."
          />
        </form>

        <p className="text-gray-500 dark:text-gray-400 text-center mt-6 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
