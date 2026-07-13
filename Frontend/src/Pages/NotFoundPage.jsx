import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    // We use a dark background and center everything on the screen
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-9xl font-extrabold text-gray-700 tracking-widest">
        404
      </h1>

      {/* Absolute positioning trick to put text perfectly over the giant 404 */}
      <div className="bg-blue-600 px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>

      <p className="mt-8 text-gray-400 mb-6 text-center max-w-md">
        Oops! The page you are looking for doesn't exist, has been removed, or
        is temporarily unavailable.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
      >
        Return to Workspace
      </Link>
    </div>
  );
};

export default NotFoundPage;
