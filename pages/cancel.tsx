import { useRouter } from "next/router";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <h1 className="text-3xl font-bold mb-8 text-red-800">Payment Canceled</h1>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Try Again
      </button>
    </div>
  );
}
