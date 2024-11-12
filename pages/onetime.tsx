import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function OnetimePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOnetimePayment = async () => {
    setLoading(true);
    console.log(process.env.SERVER_API);
    try {
      const { data } = await axios.post(
        // `${process.env.SERVER_API}/stripe/checkout-onetime`,
        "http://localhost:3000/api/stripe/checkout-onetime",
        {
          user_id: "66fe51d541ac3972bac2ccc1",
        }
      );
      router.push(data.url);
    } catch (error) {
      console.error("Error creating onetime session", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">One-time Payment</h1>
      <button
        onClick={handleOnetimePayment}
        className={`px-6 py-3 bg-blue-500 text-white rounded-lg ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
