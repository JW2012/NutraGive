import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendFundedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { requestId, donorName, amount } = await req.json();

  if (!requestId || !amount || Number(amount) <= 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { data: request, error: fetchError } = await supabaseAdmin
    .from("requests")
    .select("amount_raised, amount_goal, status, user_id, name, title")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (request.status === "funded") {
    return NextResponse.json({ error: "Request already funded" }, { status: 400 });
  }

  const remaining = Number(request.amount_goal) - Number(request.amount_raised);
  if (Math.abs(Number(amount) - remaining) > 0.01) {
    return NextResponse.json({ error: "You must fund the full remaining amount." }, { status: 400 });
  }

  const donor = donorName || "Anonymous";

  // Record donation
  const { error: donationError } = await supabaseAdmin.from("donations").insert({
    request_id: requestId,
    donor_name: donor,
    amount: Number(amount),
  });

  if (donationError) {
    return NextResponse.json({ error: donationError.message }, { status: 500 });
  }

  const newTotal = Number(request.amount_raised) + Number(amount);
  const isFullyFunded = newTotal >= Number(request.amount_goal);
  const couponCode = isFullyFunded
    ? `NUTRAGIVE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    : undefined;

  await supabaseAdmin
    .from("requests")
    .update({
      amount_raised: newTotal,
      status: isFullyFunded ? "funded" : "open",
      ...(couponCode && { coupon_code: couponCode, approved_by: donor }),
    })
    .eq("id", requestId);

  // Send email to the requester
  if (isFullyFunded && couponCode && request.user_id) {
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(request.user_id);
      if (authUser?.user?.email) {
        await sendFundedEmail({
          toEmail: authUser.user.email,
          requesterName: request.name,
          requestTitle: request.title,
          approvedBy: donor,
          couponCode,
        });
      }
    } catch (err) {
      console.error("[donate] Failed to send funded email:", err);
    }
  }

  return NextResponse.json({ success: true, funded: isFullyFunded });
}
