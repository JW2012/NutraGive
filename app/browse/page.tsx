import { createClient } from "@/lib/supabase-server";
import BrowseClient, { type DbRequest } from "@/components/BrowseClient";

export default async function BrowsePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const requests = (data as DbRequest[] | null) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <h1
          className="text-3xl font-semibold text-green-900 mb-2"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          Open Requests
        </h1>
        <p className="text-stone-400 text-sm">
          Every dollar becomes real food — delivered right to their door.
        </p>
      </div>

      <BrowseClient requests={requests} />
    </div>
  );
}
