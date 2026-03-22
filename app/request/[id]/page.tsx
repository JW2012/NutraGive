import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: request, error } = await supabaseAdmin
    .from("requests")
    .select("id, name, title, description, amount_goal, amount_raised, status, tags, feeds_people, feeds_weeks, created_at")
    .eq("id", id)
    .single();

  if (error || !request) notFound();

  const feeds = request.feeds_people ?? 1;
  const weeks = request.feeds_weeks ?? 1;
  const pct = Math.min(100, (request.amount_raised / request.amount_goal) * 100);
  const isFunded = request.status === "funded";

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/browse" className="text-green-700 text-sm mb-6 hover:underline block">
        ← Back to requests
      </Link>

      <div className="bg-white border border-stone-100 rounded-3xl p-8 shadow-sm">
        {/* Status badge */}
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs text-stone-400">{request.name}</p>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
              isFunded
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isFunded ? "Funded" : "Open"}
          </span>
        </div>

        <h1
          className="text-2xl font-semibold text-green-900 mb-3"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          {request.title}
        </h1>

        <p className="text-stone-500 leading-relaxed mb-6">{request.description}</p>

        {/* Tags */}
        {request.tags && request.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {request.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full border bg-green-50 text-green-700 border-green-200 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-stone-400 mb-1.5">
            <span>${request.amount_raised} raised</span>
            <span>${request.amount_goal} goal</span>
          </div>
          <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Feeds info */}
        <div className="flex items-center gap-2 text-sm text-stone-500 mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500 shrink-0">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2C12 3 9 2 5 5c-4.27 3.43-4.17 9.6-4 12l2-.5C3.3 14.18 4 8.5 8 7c3.36-1.26 6.37-.4 9 1z" />
          </svg>
          <span>
            Feeds {feeds === 1 ? "1 person" : `${feeds} people`} for {weeks === 1 ? "1 week" : `${weeks} weeks`}
          </span>
        </div>

        {isFunded ? (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 36" className="w-6 h-6" fill="none">
                <path d="M16 29 C16 29 4 21 4 13 C4 9 7 6 11 6 C13 6 15 7 16 9 C17 7 19 6 21 6 C25 6 28 9 28 13 C28 21 16 29 16 29Z" fill="#15803d"/>
                <path d="M16 9 L16 26" stroke="#dcfce7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
                <path d="M16 15 L12 12" stroke="#dcfce7" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                <path d="M16 19 L20 16" stroke="#dcfce7" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
                <path d="M16 29 C16 31 14 33 12 34" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-green-700 font-medium">This request has been fully funded.</p>
            </div>
            <Link
              href="/browse"
              className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition text-sm font-medium"
            >
              Browse open requests
            </Link>
          </div>
        ) : (
          <Link
            href={`/give/${request.id}`}
            className="block text-center bg-green-700 text-white py-4 rounded-full font-medium hover:bg-green-800 transition"
          >
            Give ${request.amount_goal - request.amount_raised} to fully fund →
          </Link>
        )}
      </div>
    </div>
  );
}
