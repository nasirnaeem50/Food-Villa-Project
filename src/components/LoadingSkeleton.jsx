const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-300"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="flex justify-between items-center mt-4">
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="flex items-center space-x-4 p-4 border-b animate-pulse">
        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded mb-1 w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-2 w-5/6"></div>
      <div className="h-4 bg-gray-300 rounded w-4/6"></div>
    </div>
  );
};

export default LoadingSkeleton;