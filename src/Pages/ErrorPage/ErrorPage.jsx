import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center max-w-2xl w-full rounded-lg p-8">
        {/* Icon */}
        <div className="text-7xl text-yellow-500 mb-6 flex justify-center">
          <FaExclamationTriangle />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Ooops! Something Went Wrong
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6 text-sm">
          The page you're looking for seems to have vanished. It might have been moved, renamed, or never existed in the first place.
          <br />
          Don’t worry, we’ve got you covered. Click below to return to the homepage and continue exploring!
        </p>

        {/* Go to Home Button */}
        <Link to="/">
          <button className="btn btn-primary text-white">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
