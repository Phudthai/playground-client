import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscriptionPayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.SERVER_API}/stripe/checkout-subscription`,
        {
          userId: "12345",
          priceId: "price_12345", // เปลี่ยนเป็น priceId ที่ต้องการ
        }
      );
      router.push(data.url); // ไปที่ Stripe checkout session URL
    } catch (error) {
      console.error("Error creating subscription session", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Subscription Payment</h1>
      <button
        onClick={handleSubscriptionPayment}
        className={`px-6 py-3 bg-green-500 text-white rounded-lg ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Subscribe Now"}
      </button>
    </div>
  );
}
