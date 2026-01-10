/**
 * DeleteConfirmModal Component
 * Confirmation modal for deleting a user
 * @module components/DeleteConfirmModal
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Object|null} user - User object to delete
 * @param {boolean} isLoading - Loading state during deletion
 * @param {Function} onClose - Callback function to close the modal
 * @param {Function} onConfirm - Callback function when deletion is confirmed
 */

const DeleteConfirmModal = ({ isOpen, user, isLoading, onClose, onConfirm }) => {
  if (!isOpen || !user) return null;

  const handleConfirm = () => {
    onConfirm(user.UserID);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 id="delete-title" className="text-2xl font-bold text-gray-800 text-center mb-2">
            Delete User
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-800">{user.Name}</span>?
            <br />
            <span className="text-sm text-red-600 mt-2 block">
              This action cannot be undone.
            </span>
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Cancel deletion"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label={`Confirm deletion of ${user.Name}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

