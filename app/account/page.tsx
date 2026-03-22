import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import AccountTabs from "@/components/AccountTabs";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: requests } = await supabase
    .from("requests")
    .select("id, title, description, status, amount_goal, amount_raised, coupon_code, approved_by")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-green-900"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          My Requests
        </h1>
        <p className="text-stone-400 text-sm mt-1">{user.email}</p>
      </div>

      <AccountTabs requests={requests ?? []} />
    </div>
  );
}
