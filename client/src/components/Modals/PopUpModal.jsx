const PopUpModal = ({ handleCancel, handleConfirm, message }) => {
  return (
    <div className="fixed inset-0 bg-[var(--bg)]/50 flex justify-center items-center z-50">
      <div className="bg-[var(--highlight)] text-[var(--text)] p-6 rounded shadow-lg w-full max-w-sm">
        <p className="mb-4 text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm bg-gray-300 dark:bg-zinc-700 rounded hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
