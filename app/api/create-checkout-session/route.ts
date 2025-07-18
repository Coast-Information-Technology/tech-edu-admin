// import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // const { items, customerEmail } = await req.json();

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   line_items: items.map((item: any) => ({
  //     price_data: {
  //       currency: "gbp",
  //       product_data: {
  //         name: item.title,
  //         images: [item.image],
  //       },
  //       unit_amount: Math.round(item.price * 100),
  //     },
  //     quantity: 1,
  //   })),
  //   mode: "payment",
  //   customer_email: customerEmail,
  //   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?success=true`,
  //   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?canceled=true`,
  // });

  // return NextResponse.json({ id: session.id });

  // Return a 200 OK response to prevent build errors.
  // TODO: Uncomment the code above and add your Stripe secret key to your environment variables.
  return new NextResponse(null, { status: 200 });
}
