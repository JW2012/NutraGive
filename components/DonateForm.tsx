"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Request = {
  id: string;
  name: string;
  title: string;
  description: string;
  amount_goal: number;
  amount_raised: number;
  feeds_people: number | null;
  feeds_weeks: number | null;
};

export default function DonateForm({ request }: { request: Request }) {
  const router = useRouter();
  const [donorName, setDonorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const remaining = Math.max(0, request.amount_goal - request.amount_raised);
  const feeds = request.feeds_people ?? 1;
  const weeks = request.feeds_weeks ?? 1;

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId: request.id,
        donorName: donorName || "Anonymous",
        amount: remaining,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1
          className="text-2xl font-semibold text-green-900 mb-2"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          Thank you{donorName ? `, ${donorName}` : ""}!
        </h1>
        <p className="text-stone-500 mb-8">
          Your ${remaining} gift fully funds <strong>{request.name}</strong>&apos;s request.
          They&apos;ll receive their food credits shortly.
        </p>
        <button
          onClick={() => router.push("/browse")}
          className="bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800 transition text-sm font-medium btn-glow"
        >
          Back to requests
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <button
        onClick={() => router.push("/browse")}
        className="text-green-700 text-sm mb-6 hover:underline"
      >
        ← Back
      </button>

      {/* Request summary card */}
      <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm mb-8">
        <p className="text-xs text-stone-400 mb-1">{request.name}</p>
        <h1
          className="text-xl font-semibold text-green-900 mb-3"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          {request.title}
        </h1>
        <p className="text-stone-500 text-sm mb-4 leading-relaxed">{request.description}</p>

        {request.amount_raised > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-stone-400 mb-1.5">
              <span>${request.amount_raised} raised</span>
              <span>${request.amount_goal} goal</span>
            </div>
            <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${Math.min(100, (request.amount_raised / request.amount_goal) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-3xl font-semibold text-green-800" style={{ fontFamily: "var(--font-lora), serif" }}>
            ${remaining}
            <span className="text-stone-400 text-sm font-normal ml-1">needed</span>
          </span>
          <span className="text-xs text-stone-500 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="inline-block mr-1 align-middle w-3.5 h-3.5 text-green-500">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2C12 3 9 2 5 5c-4.27 3.43-4.17 9.6-4 12l2-.5C3.3 14.18 4 8.5 8 7c3.36-1.26 6.37-.4 9 1z" />
            </svg>
            Feeds {feeds === 1 ? "1 person" : `${feeds} people`} for {weeks === 1 ? "1 week" : `${weeks} weeks`}
          </span>
        </div>
      </div>

      <form onSubmit={handleDonate} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-stone-500 mb-1.5">Your name (optional)</label>
          <input
            type="text"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Anonymous"
            className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white py-4 rounded-full font-medium hover:bg-green-800 transition disabled:opacity-60 text-base btn-glow"
        >
          {loading ? "Processing…" : `Give $${remaining} and fully fund this request →`}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-xs text-stone-400 mb-2">Share this request</p>
        <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-xs text-stone-500 truncate flex-1">{shareUrl}</span>
          <button
            onClick={handleCopy}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition ${
              copied
                ? "bg-green-50 text-green-700 border-green-200"
                : "border-stone-200 text-stone-600 hover:bg-stone-50"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <p className="text-xs text-stone-400 text-center mt-3">
        Your donation becomes food credits delivered directly to {request.name}.
      </p>
    </div>
  );
}
