const LoadingSpinner = ({ className = '' }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent w-6 h-6 ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;