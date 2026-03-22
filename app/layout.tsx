import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import SignOutButton from "@/components/SignOutButton";
import ChatWidget from "@/components/ChatWidget";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NutraGive — Food for Those Who Need It",
  description: "Help reduce malnutrition by sponsoring food requests in your community.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <nav className="sticky top-0 z-50 px-6 py-0 flex items-center justify-between border-b border-green-200 bg-white shadow-sm">
          <Link href="/" aria-label="NutraGive home">
            <Image src="/nutragive_logo.png" width={56} height={56} alt="NutraGive logo" className="w-14 h-14" />
          </Link>
          <div className="flex gap-4 text-sm items-center">
            {user && (
              <span className="text-stone-400 text-sm">
                Greetings, {user.user_metadata?.username ?? user.user_metadata?.name ?? user.email?.split("@")[0]}
              </span>
            )}
            <Link href="/browse" className="text-green-700 hover:text-green-900 transition">Browse</Link>
            {user ? (
              <>
                <Link href="/account" className="text-green-700 hover:text-green-900 transition">
                  My Requests
                </Link>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-stone-500 hover:text-stone-700 transition">
                  Log in
                </Link>
                <Link href="/auth/signup" className="bg-green-700 text-white font-medium px-4 py-2 rounded-full hover:bg-green-800 transition text-sm btn-glow">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
        {children}
        <ChatWidget />
        <footer className="text-center text-xs text-stone-400 py-10" style={{ fontFamily: "var(--font-lora), serif" }}>
          NutraGive — nourishing communities, one meal at a time.
        </footer>
      </body>
    </html>
  );
}
