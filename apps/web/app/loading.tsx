import { Activity } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      <Activity className="animate-spin text-blue-600 mb-4" size={40} />
      <p className="text-gray-500 font-medium">Loading module data...</p>
    </div>
  );
}