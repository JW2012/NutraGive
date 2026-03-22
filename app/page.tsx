import Link from "next/link";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import LanguageCycler from "@/components/LanguageCycler";

const TAG_COLORS: Record<string, string> = {
  children:       "bg-amber-50 text-amber-700 border-amber-200",
  infant:         "bg-pink-50 text-pink-700 border-pink-200",
  elderly:        "bg-blue-50 text-blue-700 border-blue-200",
  "single parent":"bg-purple-50 text-purple-700 border-purple-200",
  urgent:         "bg-red-50 text-red-600 border-red-200",
  adult:          "bg-stone-50 text-stone-600 border-stone-200",
  unemployed:     "bg-orange-50 text-orange-700 border-orange-200",
  family:         "bg-teal-50 text-teal-700 border-teal-200",
  medical:        "bg-cyan-50 text-cyan-700 border-cyan-200",
  caregiver:      "bg-indigo-50 text-indigo-700 border-indigo-200",
  "school break": "bg-yellow-50 text-yellow-700 border-yellow-200",
};

type MarqueeRequest = {
  id: string;
  name: string;
  title: string;
  amount_goal: number;
  tags: string[] | null;
};

const DUMMY_REQUESTS: MarqueeRequest[] = [
  { id: "1",  name: "Maria",   title: "Groceries for my two kids while I look for work",          amount_goal: 130, tags: ["children"] },
  { id: "2",  name: "James",   title: "One month of meals after a medical emergency",              amount_goal: 260, tags: ["medical"] },
  { id: "3",  name: "Priya",   title: "Feeding my family of five through the school break",       amount_goal: 195, tags: ["family", "school break"] },
  { id: "4",  name: "Diana",   title: "Help keeping my elderly mother nourished at home",         amount_goal: 115, tags: ["elderly"] },
  { id: "5",  name: "Carlos",  title: "Urgent — out of food and payday is two weeks away",        amount_goal: 75,  tags: ["urgent"] },
  { id: "6",  name: "Aisha",   title: "Baby formula and fresh produce for my infant son",         amount_goal: 90,  tags: ["infant"] },
  { id: "7",  name: "Tom",     title: "Laid off last month — trying to keep the fridge stocked",  amount_goal: 150, tags: ["unemployed"] },
  { id: "8",  name: "Elena",   title: "Caring for my disabled brother while between jobs",        amount_goal: 175, tags: ["caregiver"] },
  { id: "9",  name: "Fatima",  title: "Single parent of three — any help means the world",        amount_goal: 200, tags: ["single parent"] },
  { id: "10", name: "Liam",    title: "Fresh food while recovering from surgery",                 amount_goal: 110, tags: ["medical"] },
  { id: "11", name: "Yemi",    title: "Two weeks of groceries for my growing family",             amount_goal: 160, tags: ["family"] },
  { id: "12", name: "Sophie",  title: "Helping my grandmother eat well on a fixed income",        amount_goal: 85,  tags: ["elderly"] },
];

const STATS = [
  {
    number: "673M",
    label: "people face chronic hunger worldwide",
    source: "United Nations",
  },
  {
    number: "3.1M",
    label: "children die from malnutrition every year",
    source: "UNICEF",
  },
  {
    number: "$65",
    label: "can feed a family for a full week",
    source: "USDA Thrifty Food Plan",
  },
];

const REQUESTER_STEPS = [
  "Tell us your name",
  "How many people you're feeding",
  "How long you need support",
  "Who the food is for",
  "How much you need",
  "Describe your situation",
];

const DONOR_STEPS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600 mx-auto">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    label: "Browse requests",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600 mx-auto">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2C12 3 9 2 5 5c-4.27 3.43-4.17 9.6-4 12l2-.5C3.3 14.18 4 8.5 8 7c3.36-1.26 6.37-.4 9 1z" />
      </svg>
    ),
    label: "Choose someone to help",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600 mx-auto">
        <path d="M12 22V12" />
        <path d="M12 12C12 12 7 10 7 6a5 5 0 0 1 10 0c0 4-5 6-5 6z" />
        <path d="M8 20h8" />
      </svg>
    ),
    label: "Give in seconds",
  },
];

export default function Home() {
  const mid = Math.ceil(DUMMY_REQUESTS.length / 2);
  const row1 = DUMMY_REQUESTS.slice(0, mid);
  const row2 = DUMMY_REQUESTS.slice(mid);

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6 pt-8 pb-20">
        <div className="fade-up fade-up-1 mb-6">
          <Image src="/nutragive_logo.png" width={160} height={160} alt="NutraGive logo" className="w-40 h-40" />
        </div>

        <h1
          className="fade-up fade-up-2 text-5xl sm:text-6xl font-semibold text-green-900 mb-6 leading-tight max-w-2xl"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          Give the gift of a meal.
        </h1>

        <p className="fade-up fade-up-3 text-stone-500 text-lg max-w-md mb-10 leading-relaxed">
          NutraGive connects caring donors with families in need. Every dollar becomes real food — delivered right to their door.
        </p>

        <div className="fade-up fade-up-4 flex flex-col sm:flex-row gap-4">
          <Link
            href="/browse"
            className="bg-green-700 text-white text-base font-medium px-8 py-4 rounded-full hover:bg-green-800 transition shadow-sm btn-glow"
          >
            Start Giving
          </Link>
          <Link
            href="/request/new"
            className="bg-white text-green-800 text-base font-medium px-8 py-4 rounded-full border border-green-200 hover:border-green-400 hover:bg-green-50 transition shadow-sm btn-glow"
          >
            Request Funds
          </Link>
        </div>
      </section>

      {/* ── 2. Stats ─────────────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll className="text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest text-green-600 mb-3">The reality</p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-green-900"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Hunger is closer than you think.
            </h2>
          </RevealOnScroll>

          <div className="grid sm:grid-cols-3 gap-10 text-center">
            {STATS.map((s, i) => (
              <RevealOnScroll key={s.number} delay={i * 150}>
                <div
                  className="text-5xl font-semibold text-green-800 mb-3"
                  style={{ fontFamily: "var(--font-lora), serif" }}
                >
                  {s.number}
                </div>
                <p className="text-stone-600 text-base leading-snug mb-1">{s.label}</p>
                <p className="text-xs text-stone-400">{s.source}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. How It Works — Requesters ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <RevealOnScroll className="mb-10">
            <h2
              className="text-4xl sm:text-5xl font-semibold text-green-900 leading-tight mb-2"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Get Funded.
            </h2>
            <p
              className="text-4xl sm:text-5xl font-semibold text-green-600 leading-tight"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              It&apos;s as easy as six steps.
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {REQUESTER_STEPS.map((step, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className="flex items-start gap-3 bg-white border border-stone-100 rounded-2xl p-4 shadow-sm h-full">
                  <span
                    className="text-green-700 font-semibold text-sm mt-0.5 shrink-0"
                    style={{ fontFamily: "var(--font-lora), serif" }}
                  >
                    {i + 1}.
                  </span>
                  <span className="text-stone-600 text-sm leading-snug">{step}</span>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={200} className="mb-8">
            <p className="text-stone-500 text-base leading-relaxed">
              That&apos;s it. Just answer a few simple questions about your situation — our AI takes your words and crafts a compelling, dignified post that donors can connect with. No writing skills needed.
            </p>
          </RevealOnScroll>

          <RevealOnScroll delay={280}>
            <LanguageCycler />
          </RevealOnScroll>

          <RevealOnScroll delay={360}>
            <Link
              href="/request/new"
              className="inline-block bg-green-700 text-white font-medium px-8 py-4 rounded-full hover:bg-green-800 transition btn-glow"
            >
              Request Funds →
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── 4. How It Works — Donors ─────────────────────────────────── */}
      <section className="bg-green-50 py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <RevealOnScroll className="mb-10">
            <h2
              className="text-4xl sm:text-5xl font-semibold text-green-900 leading-tight mb-2"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Make a difference.
            </h2>
            <p
              className="text-4xl sm:text-5xl font-semibold text-green-600 leading-tight"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              In three clicks.
            </p>
          </RevealOnScroll>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {DONOR_STEPS.map((step, i) => (
              <RevealOnScroll key={i} delay={i * 150} className="flex-1">
                <div className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm text-center h-full">
                  <div className="mb-3">{step.icon}</div>
                  <p className="text-stone-700 text-sm font-medium">{step.label}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={200}>
            <Link
              href="/browse"
              className="inline-block bg-green-700 text-white font-medium px-8 py-4 rounded-full hover:bg-green-800 transition btn-glow"
            >
              Start Giving →
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── 5. Live Requests Marquee ─────────────────────────────────── */}
      <section className="py-20 overflow-hidden">
          <RevealOnScroll className="text-center mb-10 px-6">
            <p className="text-xs font-medium uppercase tracking-widest text-green-600 mb-3">Live requests</p>
            <h2
              className="text-3xl sm:text-4xl font-semibold text-green-900"
              style={{ fontFamily: "var(--font-lora), serif" }}
            >
              Real people. Real need. Right now.
            </h2>
          </RevealOnScroll>

          <div
            className="marquee-strip flex flex-col gap-4"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
          >
            {/* Row 1 — scrolls left */}
            <div className="flex gap-4 marquee-track" style={{ width: "max-content" }}>
              {[...row1, ...row1].map((r, i) => (
                <MarqueeCard key={`r1-${i}`} request={r} />
              ))}
            </div>
            {/* Row 2 — scrolls right */}
            <div className="flex gap-4 marquee-track-reverse" style={{ width: "max-content" }}>
              {[...row2, ...row2].map((r, i) => (
                <MarqueeCard key={`r2-${i}`} request={r} />
              ))}
            </div>
          </div>

          <RevealOnScroll className="text-center mt-10 px-6">
            <Link href="/browse" className="text-green-700 text-sm hover:underline">
              See all requests →
            </Link>
          </RevealOnScroll>
        </section>

      {/* ── 6. Closing CTA ───────────────────────────────────────────── */}
      <section className="bg-green-900 py-24 px-6">
        <RevealOnScroll className="max-w-2xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl font-semibold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            Every meal matters.
          </h2>
          <p className="text-green-200 text-lg mb-10">Start today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="bg-white text-green-900 font-medium px-8 py-4 rounded-full hover:bg-green-50 transition btn-glow"
            >
              Start Giving
            </Link>
            <Link
              href="/request/new"
              className="border border-white text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 transition"
            >
              Request Funds
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}

function MarqueeCard({ request }: { request: MarqueeRequest }) {
  const firstTag = request.tags?.[0];
  return (
    <div className="w-64 shrink-0 bg-white border border-stone-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-2xl font-semibold text-green-800"
          style={{ fontFamily: "var(--font-lora), serif" }}
        >
          ${request.amount_goal}
        </span>
        {firstTag && (
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TAG_COLORS[firstTag] ?? "bg-green-50 text-green-700 border-green-200"}`}>
            {firstTag}
          </span>
        )}
      </div>
      <p className="text-xs text-stone-400 mb-0.5">{request.name}</p>
      <p className="text-sm font-medium text-green-900 leading-snug line-clamp-2" style={{ fontFamily: "var(--font-lora), serif" }}>
        {request.title}
      </p>
    </div>
  );
}
