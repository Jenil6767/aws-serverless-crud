/**
 * LoadingSpinner Component
 * Reusable loading spinner component
 * @module components/LoadingSpinner
 */

const LoadingSpinner = ({ size = 'w-12 h-12' }) => {
  return (
    <div className="flex justify-center items-center p-8">
      <div
        className={`${size} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

