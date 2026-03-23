"use client";

import { useState } from "react";
import Link from "next/link";

const TAG_COLORS: Record<string, string> = {
  children:       "bg-amber-50 text-amber-700 border-amber-200",
  elderly:        "bg-blue-50 text-blue-700 border-blue-200",
  family:         "bg-teal-50 text-teal-700 border-teal-200",
  urgent:         "bg-red-50 text-red-600 border-red-200",
  unemployed:     "bg-orange-50 text-orange-700 border-orange-200",
  "single parent":"bg-purple-50 text-purple-700 border-purple-200",
  medical:        "bg-cyan-50 text-cyan-700 border-cyan-200",
  student:        "bg-violet-50 text-violet-700 border-violet-200",
  refugee:        "bg-green-50 text-green-700 border-green-200",
};

const ALL_TAGS = Object.keys(TAG_COLORS);



export type DbRequest = {
  id: string;
  name: string;
  title: string;
  description: string;
  amount_goal: number;
  amount_raised: number;
  status: string;
  tags: string[] | null;
  feeds_people: number | null;
  feeds_weeks: number | null;
};

export default function BrowseClient({ requests }: { requests: DbRequest[] }) {
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const PAGE_SIZE = 9;
  const filtersActive = search.trim() !== "" || activeTags.size > 0 || minPrice !== "" || maxPrice !== "";

  const filtered = requests.filter((r) => {
    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;
    if (min !== null && r.amount_goal < min) return false;
    if (max !== null && r.amount_goal > max) return false;
    if (activeTags.size > 0 && !Array.from(activeTags).some((t) => r.tags?.includes(t))) return false;
    const q = search.trim().toLowerCase();
    if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q) && !r.name.toLowerCase().includes(q)) return false;
    return true;
  });

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setActiveTags(new Set());
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  function applyFilter<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setPage(1); };
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (requests.length === 0) {
    return (
      <div className="text-center py-24 text-stone-400">
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 text-green-500">
            <path d="M12 22v-7" />
            <path d="M12 15C9 15 5 13 5 8c0 0 3 0 5 2 0-4 2-7 6-7 0 4-1 7-4 7 2 0 5 1 5 5-1-1-3-2-5-2z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-stone-500 mb-1">None yet!</p>
        <p className="text-sm mb-8">Be the first to request help or check back soon.</p>
        <Link href="/request/new" className="bg-green-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-green-800 transition btn-glow">
          Request food help
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Search — full width */}
      <div className="relative mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => applyFilter(setSearch)(e.target.value)}
          placeholder="Search by name, title, or description…"
          className="w-full border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
        />
      </div>

      {/* Mobile filter toggle */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-stone-200 bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 transition touch-manipulation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filters
          {activeTags.size > 0 && (
            <span className="ml-1 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
              {activeTags.size}
            </span>
          )}
          {filtersOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-auto">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-auto">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          )}
        </button>

        {/* Mobile filter panel */}
        {filtersOpen && (
          <div className="mt-3 bg-white border border-stone-100 rounded-3xl p-4 shadow-sm flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Price</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => applyFilter(setMinPrice)(e.target.value)}
                    placeholder="Min"
                    className="w-full border border-stone-200 rounded-xl pl-6 pr-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => applyFilter(setMaxPrice)(e.target.value)}
                    placeholder="Max"
                    className="w-full border border-stone-200 rounded-xl pl-6 pr-2 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-2 rounded-full border font-medium transition touch-manipulation ${
                      activeTags.has(tag)
                        ? "bg-green-700 text-white border-green-700"
                        : `${TAG_COLORS[tag]} hover:opacity-80`
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {filtersActive && (
              <button onClick={clearFilters} className="text-xs text-stone-400 hover:text-stone-600 transition text-left">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sidebar + grid layout */}
      <div className="flex gap-6 items-start">

        {/* Left sidebar — filters (desktop only) */}
        <aside className="hidden sm:block w-52 shrink-0">
          <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-sm flex flex-col gap-6">

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Price</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => applyFilter(setMinPrice)(e.target.value)}
                    placeholder="Min"
                    className="w-full border border-stone-200 rounded-xl pl-6 pr-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => applyFilter(setMaxPrice)(e.target.value)}
                    placeholder="Max"
                    className="w-full border border-stone-200 rounded-xl pl-6 pr-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Tags</p>
              <div className="grid grid-cols-2 gap-1.5">
                {ALL_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2 py-1.5 rounded-full border font-medium transition truncate ${
                      activeTags.has(tag)
                        ? "bg-green-700 text-white border-green-700"
                        : `${TAG_COLORS[tag]} hover:opacity-80`
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            {filtersActive && (
              <button onClick={clearFilters} className="text-xs text-stone-400 hover:text-stone-600 transition text-left">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Right — results */}
        <div className="flex-1 min-w-0">
          {filtersActive && (
            <p className="text-xs text-stone-400 mb-4">
              Showing {filtered.length} of {requests.length} requests
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <p className="text-base font-medium text-stone-500 mb-2">No requests match your filters.</p>
              <button onClick={clearFilters} className="text-sm text-green-700 hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((r) => (
                <div key={r.id} className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-4xl font-semibold text-green-800" style={{ fontFamily: "var(--font-lora), serif" }}>
                        ${r.amount_goal}
                      </span>
                      <span className="text-stone-400 text-sm ml-1">requested</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-2xl shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-green-500 shrink-0">
                        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2C12 3 9 2 5 5c-4.27 3.43-4.17 9.6-4 12l2-.5C3.3 14.18 4 8.5 8 7c3.36-1.26 6.37-.4 9 1z" />
                      </svg>
                      <div className="text-right">
                        <p className="text-xs font-medium text-stone-600 leading-none">{r.feeds_people ?? 1} {(r.feeds_people ?? 1) === 1 ? "person" : "people"}</p>
                        <p className="text-xs text-stone-400 leading-none mt-0.5">{r.feeds_weeks ?? 1} {(r.feeds_weeks ?? 1) === 1 ? "week" : "weeks"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-stone-400 mb-1">{r.name}</p>
                    <h2 className="text-lg font-semibold text-green-900 leading-snug" style={{ fontFamily: "var(--font-lora), serif" }}>
                      {r.title}
                    </h2>
                  </div>

                  <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">{r.description}</p>

                  {r.tags && r.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.tags.map((tag) => (
                        <span key={tag} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TAG_COLORS[tag] ?? "bg-green-50 text-green-700 border-green-200"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/give/${r.id}`} className="mt-auto block text-center bg-green-700 text-white text-sm font-medium py-3.5 rounded-full hover:bg-green-800 transition btn-glow touch-manipulation">
                    Learn more
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 mt-8">
              {page > 1 && (
                <button
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 h-9 rounded-full text-sm font-medium border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                >
                  ← Previous
                </button>
              )}

              {(() => {
                const btnClass = (p: number) =>
                  `w-9 h-9 rounded-full text-sm font-medium transition ${page === p ? "bg-green-700 text-white" : "border border-stone-200 text-stone-600 hover:bg-stone-50"}`;
                const ellipsis = <span key="ellipsis" className="px-1 text-stone-400 text-sm">…</span>;

                if (totalPages <= 6) {
                  return Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={btnClass(p)}>{p}</button>
                  ));
                }

                return [
                  ...[1, 2, 3].map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={btnClass(p)}>{p}</button>
                  )),
                  ellipsis,
                  ...[totalPages - 2, totalPages - 1, totalPages].map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={btnClass(p)}>{p}</button>
                  )),
                ];
              })()}

              {page < totalPages && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 h-9 rounded-full text-sm font-medium border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
