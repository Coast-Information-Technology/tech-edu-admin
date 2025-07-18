"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PaymentForm({ amount = 5000, currency = "gbp" }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)!,
    });

    if (pmError) {
      setStatus("error");
      setError(pmError.message || "Payment failed");
    } else {
      setStatus("success");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      <Button type="submit" disabled={!stripe}>
        Pay{" "}
        {(amount / 100).toLocaleString("en-GB", {
          style: "currency",
          currency,
        })}
      </Button>
      {status === "success" && (
        <div className="text-green-600">
          Payment simulated! (No real charge)
        </div>
      )}
      {status === "error" && <div className="text-red-600">{error}</div>}
      <div className="text-xs text-gray-500">
        Use test card: 4242 4242 4242 4242, any future date, any CVC
      </div>
    </form>
  );
}

export default function StripePaymentForm(props: {
  amount: number;
  currency?: string;
}) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
