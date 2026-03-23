import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase-server";
import NavBar from "@/components/NavBar";
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
  verification: {
    google: "f6O1w6w6g2k3BDm9PaJLO39wX09K2PlyPlbgkjkOx0k",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <NavBar
          user={!!user}
          username={user?.user_metadata?.username ?? user?.user_metadata?.name ?? user?.email?.split("@")[0]}
        />
        {children}
        <ChatWidget />
        <footer className="text-center text-xs text-stone-400 py-10" style={{ fontFamily: "var(--font-lora), serif" }}>
          NutraGive — nourishing communities, one meal at a time.
        </footer>
      </body>
    </html>
  );
}
