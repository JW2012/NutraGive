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
    console.error("AI assist error:", e);
    return NextResponse.json({ error: "Failed to generate request" }, { status: 500 });
  }
}
