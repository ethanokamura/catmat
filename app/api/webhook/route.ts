import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  try {
    const metadata = session.metadata;
    const items = metadata?.items ? JSON.parse(metadata.items) : [];

    // Get shipping details - use collected_information for newer Stripe API
    const shippingDetails = session.collected_information?.shipping_details;
    const customerEmail = session.customer_email || session.customer_details?.email;

    // Create order in Firestore
    const order = {
      email: customerEmail || "",
      items: items.map(
        (item: {
          productId: string;
          name: string;
          quantity: number;
          price: number;
        }) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })
      ),
      subtotal: session.amount_subtotal || 0,
      shipping: session.shipping_cost?.amount_total || 0,
      tax: session.total_details?.amount_tax || 0,
      total: session.amount_total || 0,
      status: "processing",
      shippingAddress: shippingDetails?.address
        ? {
            name: shippingDetails.name || "",
            line1: shippingDetails.address.line1 || "",
            line2: shippingDetails.address.line2 || "",
            city: shippingDetails.address.city || "",
            state: shippingDetails.address.state || "",
            postalCode: shippingDetails.address.postal_code || "",
            country: shippingDetails.address.country || "",
          }
        : null,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminDb.collection("orders").add(order);
    console.log("Order created for session:", session.id);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

