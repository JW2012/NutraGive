import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { requestId, donorName, amount } = session.metadata!;

    // Record donation
    await supabaseAdmin.from("donations").insert({
      request_id: requestId,
      donor_name: donorName,
      amount: Number(amount),
      stripe_payment_intent_id: session.payment_intent as string,
    });

    // Update amount raised
    const { data: req_ } = await supabaseAdmin
      .from("requests")
      .select("amount_raised, amount_goal")
      .eq("id", requestId)
      .single();

    if (req_) {
      const newTotal = Number(req_.amount_raised) + Number(amount);
      const isFullyFunded = newTotal >= Number(req_.amount_goal);
      await supabaseAdmin
        .from("requests")
        .update({
          amount_raised: newTotal,
          status: isFullyFunded ? "funded" : "open",
          // In production: generate real Instacart coupon here when funded
          ...(isFullyFunded && { coupon_code: `NUTRAGIVE-${Date.now()}` }),
        })
        .eq("id", requestId);
    }
  }

  return NextResponse.json({ received: true });
}
