"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type WizardState = {
  step: number | "review" | "done";
  name: string;
  peopleCount: string;
  duration: string;
  whoFor: string;
  whoForOther: string;
  amount: string;
  urgency: string;
  situation: string;
  preview: { title: string; description: string } | null;
  requestId: string;
  loading: boolean;
  error: string;
};

// ─── Amount suggestion (USDA Thrifty Food Plan, Jan 2025) ────────────────────

const BASE_RATE: Record<string, number> = {
  myself: 65,
  children: 52,
  family: 60,
  elderly: 58,
  other: 65,
};

const PEOPLE_MULT: Record<string, { count: number; adj: number }> = {
  "just-me": { count: 1,   adj: 1.20 },
  "2-3":     { count: 2.5, adj: 1.10 },
  "4-5":     { count: 4,   adj: 1.00 },
  "6+":      { count: 6,   adj: 0.95 },
};

const WEEK_MULT: Record<string, number> = {
  "1w": 1, "2w": 2, "3-4w": 3, "1m": 4,
};

const FEEDS_PEOPLE: Record<string, number> = {
  "just-me": 1, "2-3": 2, "4-5": 4, "6+": 6,
};

const FEEDS_WEEKS: Record<string, number> = {
  "1w": 1, "2w": 2, "3-4w": 3, "1m": 4,
};

function computeSuggestion(peopleCount: string, whoFor: string, duration: string): number | null {
  const base = BASE_RATE[whoFor];
  const people = PEOPLE_MULT[peopleCount];
  const weeks = WEEK_MULT[duration];
  if (!base || !people || !weeks) return null;
  const raw = base * people.count * people.adj * weeks;
  return Math.round(raw / 5) * 5;
}

function deriveTags(whoFor: string, urgency: string): string[] {
  const tags: string[] = [];
  if (whoFor === "children") tags.push("children");
  if (whoFor === "elderly")  tags.push("elderly");
  if (whoFor === "family")   tags.push("family");
  if (urgency === "critical" || urgency === "urgent") tags.push("urgent");
  return tags;
}

// ─── Shared UI components ─────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all ${
            i === current
              ? "w-6 h-2.5 bg-green-600"
              : i < current
              ? "w-2.5 h-2.5 bg-green-300"
              : "w-2.5 h-2.5 bg-stone-200"
          }`}
        />
      ))}
    </div>
  );
}

function TileButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full py-4 px-4 rounded-2xl border-2 text-sm font-medium transition text-left ${
        selected
          ? "border-green-600 bg-green-50 text-green-900"
          : "border-stone-200 bg-white text-stone-700 hover:border-green-300 hover:bg-green-50"
      }`}
    >
      {selected && <span className="mr-2 text-green-600">✓</span>}
      {label}
    </button>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue →",
  loading,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  loading?: boolean;
}) {
  return (
    <div className="flex gap-3 mt-8">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-full border border-stone-200 text-stone-500 text-sm hover:bg-stone-50 transition"
        >
          ← Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="flex-1 bg-green-700 text-white py-3 rounded-full font-medium hover:bg-green-800 transition disabled:opacity-50 text-sm btn-glow"
      >
        {loading ? "Generating…" : nextLabel}
      </button>
    </div>
  );
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({ requestId, onViewRequests, onBrowse }: { requestId: string; onViewRequests: () => void; onBrowse: () => void }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/give/${requestId}` : "";

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🌱</div>
      <h1 className="text-2xl font-semibold text-green-900 mb-2" style={{ fontFamily: "var(--font-lora), serif" }}>
        Your request is live!
      </h1>
      <p className="text-stone-500 mb-6 text-sm leading-relaxed">
        Donors can now find and support you. Share this link to reach more people.
      </p>

      <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 flex items-center gap-3 mb-8 text-left">
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

      <div className="flex flex-col gap-3">
        <button
          onClick={onViewRequests}
          className="bg-green-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-800 transition btn-glow"
        >
          View my requests
        </button>
        <button onClick={onBrowse} className="text-green-700 text-sm hover:underline">
          Browse other requests
        </button>
      </div>
    </div>
  );
}

// ─── Wizard ───────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 7;

export default function NewRequestPage() {
  const router = useRouter();
  const [state, setState] = useState<WizardState>({
    step: 0,
    name: "",
    peopleCount: "",
    duration: "",
    whoFor: "",
    whoForOther: "",
    amount: "",
    urgency: "",
    situation: "",
    preview: null,
    requestId: "",
    loading: false,
    error: "",
  });

  function set(patch: Partial<WizardState>) {
    setState((s) => ({ ...s, ...patch }));
  }

  function goNext() {
    set({ step: (state.step as number) + 1, error: "" });
  }

  function goBack() {
    if (state.step === "review") {
      set({ step: 6 });
    } else {
      set({ step: Math.max(0, (state.step as number) - 1), error: "" });
    }
  }

  const suggestion = useMemo(
    () => computeSuggestion(state.peopleCount, state.whoFor, state.duration),
    [state.peopleCount, state.whoFor, state.duration]
  );

  async function generatePreview() {
    set({ loading: true, error: "" });
    const res = await fetch("/api/ai-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.name,
        peopleCount: state.peopleCount,
        duration: state.duration,
        whoFor: state.whoFor,
        whoForOther: state.whoForOther,
        amount: state.amount,
        urgency: state.urgency,
        situation: state.situation,
      }),
    });

    if (!res.ok) {
      set({ loading: false, error: "Something went wrong. Please try again." });
      return;
    }

    const data = await res.json();
    set({ loading: false, preview: data, step: "review" });
  }

  async function submitRequest() {
    if (!state.preview) return;
    set({ loading: true, error: "" });

    const tags = deriveTags(state.whoFor, state.urgency);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.name,
        title: state.preview.title,
        description: state.preview.description,
        amount: Number(state.amount),
        tags,
        feeds_people: FEEDS_PEOPLE[state.peopleCount] ?? 1,
        feeds_weeks: FEEDS_WEEKS[state.duration] ?? 1,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      set({ loading: false, error: data.error ?? "Failed to submit." });
      return;
    }

    const data = await res.json();
    set({ loading: false, step: "done", requestId: data.id });
  }

  // ── AI Loading overlay ────────────────────────────────────────────────────
  if (state.loading && state.step !== "review") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-20 h-20 text-green-500"
          style={{ animation: "leaf-breathe 2.5s ease-in-out infinite", transformOrigin: "bottom center" }}
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2C12 3 9 2 5 5c-4.27 3.43-4.17 9.6-4 12l2-.5C3.3 14.18 4 8.5 8 7c3.36-1.26 6.37-.4 9 1z" />
        </svg>
        <p className="text-stone-400 text-sm tracking-wide">Crafting your request…</p>
      </div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (state.step === "done") {
    return <DoneScreen requestId={state.requestId} onViewRequests={() => router.push("/account")} onBrowse={() => router.push("/browse")} />;
  }

  // ── Review ────────────────────────────────────────────────────────────────
  if (state.step === "review" && state.preview) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <p className="text-xs text-stone-400 mb-1 text-center">Almost done</p>
        <h1
          className="text-2xl font-semibold text-green-900 mb-1 text-center"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          Review your request
        </h1>
        <p className="text-stone-400 text-sm text-center mb-8">
          Our AI wrote this from your answers. Edit anything that doesn&apos;t feel right.
        </p>

        <div className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-xs text-stone-400 mb-1">Title</label>
            <input
              type="text"
              value={state.preview.title}
              onChange={(e) =>
                set({ preview: { ...state.preview!, title: e.target.value } })
              }
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-400 mb-1">Description</label>
            <textarea
              rows={4}
              value={state.preview.description}
              onChange={(e) =>
                set({ preview: { ...state.preview!, description: e.target.value } })
              }
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
            />
          </div>
          <div className="flex justify-between text-sm text-stone-500 pt-1 border-t border-stone-100">
            <span>Amount requested</span>
            <span className="font-semibold text-green-800">${state.amount}</span>
          </div>
        </div>

        {state.error && <p className="text-red-500 text-sm mb-4">{state.error}</p>}

        <NavButtons
          onBack={goBack}
          onNext={submitRequest}
          nextLabel="Submit Request"
          loading={state.loading}
        />
      </div>
    );
  }

  // ── Steps 0–6 ─────────────────────────────────────────────────────────────
  const stepNum = state.step as number;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <ProgressDots current={stepNum} total={TOTAL_STEPS} />

      {/* Step 0 — Name */}
      {stepNum === 0 && (
        <div>
          <p className="text-xs text-stone-400 text-center mb-1">Step 1 of {TOTAL_STEPS}</p>
          <h2
            className="text-2xl font-semibold text-green-900 text-center mb-2"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            What should we call you?
          </h2>
          <p className="text-stone-400 text-sm text-center mb-8">
            This is how you&apos;ll appear to donors — a first name or nickname is fine.
          </p>
          <input
            type="text"
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="e.g. Maria"
            autoFocus
            className="w-full border border-stone-200 rounded-2xl px-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
          />
          <NavButtons onNext={goNext} nextDisabled={!state.name.trim()} />
        </div>
      )}

      {/* Step 1 — People count */}
      {stepNum === 1 && (
        <div>
          <p className="text-xs text-stone-400 text-center mb-1">Step 2 of {TOTAL_STEPS}</p>
          <h2
            className="text-2xl font-semibold text-green-900 text-center mb-2"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            How many people are you feeding?
          </h2>
          <p className="text-stone-400 text-sm text-center mb-8">Include yourself if applicable.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "just-me", label: "Just me" },
              { value: "2-3",     label: "2–3 people" },
              { value: "4-5",     label: "4–5 people" },
              { value: "6+",      label: "6 or more" },
            ].map(({ value, label }) => (
              <TileButton
                key={value}
                label={label}
                selected={state.peopleCount === value}
                onClick={() => set({ peopleCount: value })}
              />
            ))}
          </div>
          <NavButtons onBack={goBack} onNext={goNext} nextDisabled={!state.peopleCount} />
        </div>
      )}

      {/* Step 2 — Duration */}
      {stepNum === 2 && (
        <div>
          <p className="text-xs text-stone-400 text-center mb-1">Step 3 of {TOTAL_STEPS}</p>
          <h2
            className="text-2xl font-semibold text-green-900 text-center mb-2"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            How long do you need food support?
          </h2>
          <p className="text-stone-400 text-sm text-center mb-8">Choose what best fits your situation.</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "1w",   label: "1 week" },
              { value: "2w",   label: "2 weeks" },
              { value: "3-4w", label: "3–4 weeks" },
              { value: "1m",   label: "About a month" },
            ].map(({ value, label }) => (
              <TileButton
                key={value}
                label={label}
                selected={state.duration === value}
                onClick={() => set({ duration: value })}
              />
            ))}
          </div>
          <NavButtons onBack={goBack} onNext={goNext} nextDisabled={!state.duration} />
        </div>
      )}

      {/* Step 3 — Who for */}
      {stepNum === 3 && (
        <div>
          <p className="text-xs text-stone-400 text-center mb-1">Step 4 of {TOTAL_STEPS}</p>
          <h2
            className="text-2xl font-semibold text-green-900 text-center mb-2"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Who is this food for?
          </h2>
          <p className="text-stone-400 text-sm text-center mb-8">Select the best fit.</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { value: "myself",   label: "Myself" },
              { value: "children", label: "My children" },
              { value: "family",   label: "My whole family" },
              { value: "elderly",  label: "An elderly relative" },
            ].map(({ value, label }) => (
              <TileButton
                key={value}
                label={label}
                selected={state.whoFor === value}
                onClick={() => set({ whoFor: value, whoForOther: "" })}
              />
            ))}
          </div>
          <TileButton
            label="Other"
            selected={state.whoFor === "other"}
            onClick={() => set({ whoFor: "other" })}
          />
          {state.whoFor === "other" && (
            <textarea
              rows={2}
              value={state.whoForOther}
              onChange={(e) => set({ whoForOther: e.target.value })}
              placeholder="Describe who you're feeding…"
              className="mt-3 w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
            />
          )}
          <NavButtons
            onBack={goBack}
            onNext={goNext}
            nextDisabled={
              !state.whoFor ||
              (state.whoFor === "other" && !state.whoForOther.trim())
            }
          />
        </div>
      )}

      {/* Step 4 — Amount */}
      {stepNum === 4 && (
        <div>
          <p className="text-xs text-stone-400 text-center mb-1">Step 5 of {TOTAL_STEPS}</p>
          <h2
            className="text-2xl font-semibold text-green-900 text-center mb-2"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            How much support do you need?
          </h2>
          <p className="text-stone-400 text-sm text-center mb-6">Enter an amount in US dollars.</p>

          {suggestion !== null && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-green-800">
                Based on your answers, we suggest around{" "}
                <span className="font-semibold">${suggestion}</span>
              </p>
              <button
                type="button"
                onClick={() => set({ amount: String(suggestion) })}
                className="text-xs text-green-700 border border-green-300 px-3 py-1.5 rounded-full hover:bg-green-100 transition shrink-0"
              >
                Use ${suggestion}
              </button>
            </div>
          )}

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg font-medium">$</span>
            <input
              type="number"
              value={state.amount}
              onChange={(e) => set({ amount: e.target.value })}
              placeholder="0"
              min="1"
              className="w-full border border-stone-200 rounded-2xl pl-8 pr-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
            />
          </div>
          <NavButtons
            onBack={goBack}
            onNext={goNext}
            nextDisabled={!state.amount || Number(state.amount) <= 0}
          />
        </div>
      )}

      {/* Step 5 — Urgency */}
      {stepNum === 5 && (
        <div>
          <p className="text-xs text-stone-400 text-center mb-1">Step 6 of {TOTAL_STEPS}</p>
          <h2
            className="text-2xl font-semibold text-green-900 text-center mb-2"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            What is your urgency level?
          </h2>
          <p className="text-stone-400 text-sm text-center mb-8">This helps donors prioritize.</p>
          <div className="flex flex-col gap-3">
            {[
              { value: "critical", label: "Critical — I need help within 1–2 days" },
              { value: "urgent",   label: "Urgent — this week" },
              { value: "soon",     label: "Soon — within the month" },
              { value: "flexible", label: "Flexible" },
            ].map(({ value, label }) => (
              <TileButton
                key={value}
                label={label}
                selected={state.urgency === value}
                onClick={() => set({ urgency: value })}
              />
            ))}
          </div>
          <NavButtons onBack={goBack} onNext={goNext} nextDisabled={!state.urgency} />
        </div>
      )}

      {/* Step 6 — Situation */}
      {stepNum === 6 && (
        <div>
          <p className="text-xs text-stone-400 text-center mb-1">Step 7 of {TOTAL_STEPS}</p>
          <h2
            className="text-2xl font-semibold text-green-900 text-center mb-2"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Describe your situation
          </h2>
          <p className="text-stone-400 text-sm text-center mb-8">
            In your own words — even a few sentences helps. Our AI will turn this into your request.
          </p>
          <textarea
            rows={6}
            value={state.situation}
            onChange={(e) => set({ situation: e.target.value })}
            placeholder="e.g. I was laid off last month and we've run out of groceries. I have two young kids at home and I'm trying to get back on my feet."
            className="w-full border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none bg-white"
          />
          {state.error && <p className="text-red-500 text-sm mt-3">{state.error}</p>}
          <NavButtons
            onBack={goBack}
            onNext={generatePreview}
            nextDisabled={!state.situation.trim()}
            nextLabel="Generate my request →"
            loading={state.loading}
          />
        </div>
      )}
    </div>
  );
}
