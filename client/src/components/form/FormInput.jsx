const FormInput = ({ label, name, register, rules, type = "text", error }) => (
  <>
    <label
      className={`p-2 border border-[#ebebeb] rounded transition-all hover:border-black focus-within:border-2 focus-within:border-black  bg-[#ebebeb] dark:focus-within:border-purple-900 dark:hover:border-purple-700 block cursor-text ${
        error &&
        "focus-within:border-red-800 dark:focus-within:border-red-800   dark:hover:border-red-800"
      }`}
    >
      <span className="block font-[Fira_Mono] text-[12px]">
        {label.toUpperCase()}
      </span>
      <input
        type={type}
        className="w-full rounded outline-none mt-1 font-mono font-extralight"
        autoComplete="off"
        {...register(name, rules)}
      />
    </label>
    {error && (
      <p className=" text-sm text-center">
        <span className="bg-red-800 rounded font-light text-white p-1">
          {error.message}
        </span>
      </p>
    )}
  </>
);

export default FormInput;
