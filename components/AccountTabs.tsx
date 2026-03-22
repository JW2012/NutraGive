"use client";

import { useState } from "react";
import Link from "next/link";

type Request = {
  id: string;
  title: string;
  description: string;
  status: string;
  amount_goal: number;
  amount_raised: number;
  coupon_code: string | null;
  approved_by: string | null;
};

export default function AccountTabs({ requests }: { requests: Request[] }) {
  const [tab, setTab] = useState<"active" | "past">("active");

  const active = requests.filter((r) => r.status === "open");
  const past   = requests.filter((r) => r.status !== "open");
  const shown  = tab === "active" ? active : past;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-2xl w-fit">
        {(["active", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              tab === t
                ? "bg-white text-green-900 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {t === "active" ? `Active (${active.length})` : `Past (${past.length})`}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="mb-4">
            {tab === "active"
              ? "You have no active requests."
              : "No past requests yet."}
          </p>
          {tab === "active" && (
            <Link
              href="/request/new"
              className="bg-green-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-800 transition"
            >
              Request food help
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {shown.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-semibold text-green-900 mb-1">{r.title}</h2>
                  <p className="text-stone-500 text-sm line-clamp-2">{r.description}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 capitalize ${
                    r.status === "funded"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : r.status === "closed"
                      ? "bg-stone-50 text-stone-500 border-stone-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="text-sm text-stone-500 mb-3">
                <span className="font-semibold text-green-800">${r.amount_raised ?? 0}</span>
                {" "}/ ${r.amount_goal} raised
              </div>

              {/* Funded state */}
              {r.status === "funded" && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-col gap-2">
                  {r.coupon_code && (
                    <div className="text-center">
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-1">
                        Your coupon code
                      </p>
                      <p className="text-2xl font-bold font-mono text-green-800 tracking-widest">
                        {r.coupon_code}
                      </p>
                    </div>
                  )}
                  {r.approved_by && (
                    <p className="text-xs text-center text-green-600">
                      Funded by <span className="font-semibold">{r.approved_by}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}

          {tab === "active" && (
            <Link
              href="/request/new"
              className="mt-2 text-center bg-green-700 text-white py-3 rounded-full text-sm font-medium hover:bg-green-800 transition"
            >
              Submit another request
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
