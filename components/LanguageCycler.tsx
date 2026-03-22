"use client";

const ENTRIES = [
  { lang: "English",   phrase: "Request food help" },
  { lang: "Español",   phrase: "Solicitar ayuda alimentaria" },
  { lang: "العربية",  phrase: "طلب مساعدة غذائية" },
  { lang: "Français",  phrase: "Demander de l'aide alimentaire" },
  { lang: "हिन्दी",    phrase: "खाद्य सहायता का अनुरोध करें" },
  { lang: "中文",      phrase: "申请食品援助" },
  { lang: "Português", phrase: "Solicitar ajuda alimentar" },
  { lang: "Kiswahili", phrase: "Omba msaada wa chakula" },
  { lang: "Türkçe",   phrase: "Yiyecek yardımı talep edin" },
  { lang: "Deutsch",   phrase: "Lebensmittelhilfe beantragen" },
  { lang: "Tagalog",   phrase: "Humingi ng tulong sa pagkain" },
  { lang: "বাংলা",    phrase: "খাদ্য সহায়তার জন্য অনুরোধ করুন" },
];

const ITEMS = [...ENTRIES, ...ENTRIES];

export default function LanguageCycler() {
  return (
    <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-green-600 shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span className="text-xs font-semibold text-green-700 uppercase tracking-widest">
          Available in 20+ languages
        </span>
      </div>

      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="flex gap-8 w-max"
          style={{ animation: "lang-scroll 55s linear infinite" }}
        >
          {ITEMS.map((entry, i) => (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <span className="text-base font-semibold text-green-900">{entry.phrase}</span>
              <span className="text-xs text-green-400 font-medium">{entry.lang}</span>
              <span className="text-green-200 text-lg select-none">·</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lang-scroll {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
