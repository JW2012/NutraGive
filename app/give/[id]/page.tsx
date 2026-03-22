import { notFound, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { createClient } from "@/lib/supabase-server";
import DonateForm from "@/components/DonateForm";

export default async function GivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: request, error }, supabase] = await Promise.all([
    supabaseAdmin
      .from("requests")
      .select("id, name, title, description, amount_goal, amount_raised, feeds_people, feeds_weeks, status, user_id")
      .eq("id", id)
      .single(),
    createClient(),
  ]);

  if (error || !request) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?next=/give/${id}`);

  if (user.id === request.user_id) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">🙏</div>
        <h1
          className="text-2xl font-semibold text-green-900 mb-2"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          This is your request
        </h1>
        <p className="text-stone-500 mb-6">
          You can&apos;t donate to your own request. Share it with others so they can help.
        </p>
        <a
          href="/browse"
          className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition text-sm font-medium"
        >
          Browse other requests
        </a>
      </div>
    );
  }

  if (request.status === "funded") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="mb-4 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 36" className="w-16 h-16" fill="none">
            {/* Heart */}
            <path d="M16 29 C16 29 4 21 4 13 C4 9 7 6 11 6 C13 6 15 7 16 9 C17 7 19 6 21 6 C25 6 28 9 28 13 C28 21 16 29 16 29Z" fill="#16a34a"/>
            {/* Leaf vein */}
            <path d="M16 9 L16 26" stroke="#dcfce7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
            <path d="M16 15 L12 12" stroke="#dcfce7" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            <path d="M16 19 L20 16" stroke="#dcfce7" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            {/* Stem */}
            <path d="M16 29 C16 31 14 33 12 34" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 31 C18 30 20 31 21 33" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
          </svg>
        </div>
        <h1
          className="text-2xl font-semibold text-green-900 mb-2"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          This request has been fully funded!
        </h1>
        <p className="text-stone-500 mb-6">
          {request.name}&apos;s request was funded. Browse other open requests to help someone today.
        </p>
        <a
          href="/browse"
          className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition text-sm font-medium"
        >
          Browse open requests
        </a>
      </div>
    );
  }

  return <DonateForm request={request} />;
}
