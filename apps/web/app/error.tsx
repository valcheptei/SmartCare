"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production: Log to monitoring service (e.g., Sentry)
    console.error("Frontend Boundary Caught Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-red-100 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">System Interruption</h2>
        <p className="text-gray-600 mb-8">
          The application encountered an unexpected error. Ensure your network connection is active.
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} />
          Reload Module
        </button>
      </div>
    </div>
  );
}