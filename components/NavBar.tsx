"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";

type NavBarProps = {
  user: boolean;
  username?: string;
};

export default function NavBar({ user, username }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 py-0 flex items-center justify-between border-b border-green-200 bg-white shadow-sm">
      {/* Logo */}
      <Link href="/" aria-label="NutraGive home" onClick={() => setMenuOpen(false)}>
        <Image src="/nutragive_logo.png" width={56} height={56} alt="NutraGive logo" className="w-14 h-14" />
      </Link>

      {/* Desktop nav */}
      <div className="hidden sm:flex gap-4 text-sm items-center">
        {user && (
          <span className="text-stone-400 text-sm">
            Greetings, {username}
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
            <Link
              href="/auth/signup"
              className="bg-green-700 text-white font-medium px-4 py-2 rounded-full hover:bg-green-800 transition text-sm btn-glow"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        className="sm:hidden p-2 rounded-xl text-green-800 hover:bg-green-50 transition"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-green-100 shadow-lg z-50 px-4 py-3 flex flex-col gap-1">
          {user && (
            <p className="text-stone-400 text-xs px-3 py-2">
              Greetings, {username}
            </p>
          )}
          <Link
            href="/browse"
            onClick={() => setMenuOpen(false)}
            className="text-green-800 font-medium px-3 py-3 rounded-xl hover:bg-green-50 transition text-sm"
          >
            Browse
          </Link>
          {user ? (
            <>
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="text-green-800 font-medium px-3 py-3 rounded-xl hover:bg-green-50 transition text-sm"
              >
                My Requests
              </Link>
              <div className="px-3 py-1">
                <SignOutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="text-stone-600 font-medium px-3 py-3 rounded-xl hover:bg-stone-50 transition text-sm"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-green-700 text-white font-medium px-4 py-3 rounded-xl hover:bg-green-800 transition text-sm text-center mt-1"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
