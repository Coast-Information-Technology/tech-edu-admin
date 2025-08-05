import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getApiRequest, postApiRequest } from "@/lib/apiFetch";

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
  const { productId, userId, ...metadata } = paymentIntent.metadata;

  if (!productId || !userId) {
    console.error("Missing productId or userId in payment metadata");
    return;
  }

  try {
    // Get product details to check if it's bookable
    const productResponse = await getApiRequest(
      `/api/products/public/${productId}`,
      null
    );

    if (!productResponse?.data?.success) {
      console.error("Product not found:", productId);
      return;
    }

    const product = productResponse.data.data;

    // Only create booking if product is bookable
    if (!product.isBookableService) {
      console.log(
        "Product is not bookable, skipping booking creation:",
        productId
      );
      return;
    }

    // Create booking automatically
    const bookingPayload = {
      productId: productId,
      productType:
        product.productType === "Academic Support Services"
          ? "AcademicService"
          : "TrainingProgram",
      instructorId: product.instructorId || null,
      bookingPurpose:
        metadata.bookingPurpose || `Booking for ${product.service}`,
      scheduleAt:
        metadata.scheduleAt ||
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endAt:
        metadata.endAt ||
        new Date(
          Date.now() +
            24 * 60 * 60 * 1000 +
            product.minutesPerSession * 60 * 1000
        ).toISOString(),
      minutesPerSession: product.minutesPerSession || 60,
      durationInMinutes: product.durationInMinutes || 60,
      numberOfExpectedParticipants: metadata.numberOfExpectedParticipants || 1,
      isClassroom: product.hasClassroom || false,
      meetingLink: metadata.meetingLink || null,
      sessionType: product.sessionType || "1-on-1",
      userNotes: metadata.userNotes || null,
      internalNotes: `Auto-created booking from payment ${paymentIntent.id}`,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      status: "confirmed",
    };

    const bookingResponse = await postApiRequest(
      "/api/bookings",
      null,
      bookingPayload
    );

    if (bookingResponse?.data?.success) {
      console.log(
        "Booking created successfully:",
        bookingResponse.data.data._id
      );
    } else {
      console.error(
        "Failed to create booking:",
        bookingResponse?.data?.message
      );
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
  }
}

async function handlePaymentFailure(paymentIntent: any) {
  console.log("Payment failed:", paymentIntent.id);
  // Handle payment failure - could send notification to user, etc.
}

async function handleCheckoutCompleted(session: any) {
  console.log("Checkout completed:", session.id);
  // Additional handling for checkout completion if needed
}
