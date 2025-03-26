import { FaExclamationTriangle } from "react-icons/fa";

export default function PaymentServerDown() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-red-700 text-white p-4">
      <div className="bg-white text-red-600 p-8 rounded-2xl shadow-2xl max-w-md text-center">
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Payment Server Down</h1>
        <p className="mt-4 text-lg">
          Oops! Our payment services are currently unavailable. We apologize for
          the inconvenience.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Please try again later or contact our support team if you need
          immediate assistance.
        </p>
        <button
          className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform transform hover:scale-105"
          onClick={() => window.location.reload()}
        >
          Retry Payment
        </button>
        <div className="mt-6">
          <a
            href="/contact"
            className="text-sm text-blue-500 hover:underline"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}