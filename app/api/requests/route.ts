import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const { data, error } = await supabaseAdmin
      .from("requests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  }
  const { data } = await supabaseAdmin
    .from("requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, title, description, amount, tags, feeds_people, feeds_weeks } = await req.json();
  const { data, error } = await supabaseAdmin
    .from("requests")
    .insert({
      name,
      title,
      description,
      amount_goal: amount,
      user_id: user.id,
      ...(tags && { tags }),
      ...(feeds_people && { feeds_people }),
      ...(feeds_weeks && { feeds_weeks }),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
