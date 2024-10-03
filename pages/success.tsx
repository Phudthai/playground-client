import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-3xl font-bold mb-8 text-green-800">
        Payment Successful!
      </h1>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Go to Home
      </button>
    </div>
  );
}
