import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object);
        break;

      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  console.log("Payment succeeded:", paymentIntent.id);
  // Payment success handling - could send confirmation email, update order status, etc.
  // Booking creation has been removed from admin dashboard
}

async function handlePaymentFailure(paymentIntent: any) {
  console.log("Payment failed:", paymentIntent.id);
  // Handle payment failure - could send notification to user, etc.
}

async function handleCheckoutCompleted(session: any) {
  console.log("Checkout completed:", session.id);
  // Additional handling for checkout completion if needed
}
