const FormButton = ({ loading, text, loadingText = "loading..." }) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-2 rounded-[8px] text-white dark:text-black  relative group ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black dark:bg-white hover:rounded-none"
    }`}
  >
    <span className="inline-flex items-center justify-center transition-all duration-300 gap-0 group-hover:translate-x-1">
      <span className="transform transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:-translate-x-1">
        →
      </span>
      <span className="transition-transform duration-300">
        {loading ? loadingText : text}
      </span>
    </span>
  </button>
);

export default FormButton;
