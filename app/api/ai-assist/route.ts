import { NextRequest, NextResponse } from "next/server";
import { generateRequestDetails } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, peopleCount, duration, whoFor, whoForOther, amount, urgency, situation } = body;

  if (!situation) return NextResponse.json({ error: "Missing situation" }, { status: 400 });

  try {
    const result = await generateRequestDetails({
      name: name || "Someone",
      peopleCount,
      duration,
      whoFor,
      whoForOther: whoForOther || "",
      amount,
      urgency,
      situation,
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("AI assist error:", msg);
    return NextResponse.json({ error: "Failed to generate request", detail: msg }, { status: 500 });
  }
}
