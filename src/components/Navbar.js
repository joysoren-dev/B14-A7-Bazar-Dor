"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const categories = [
  { name: "চাল", slug: "chal", icon: "🌾" },
  { name: "ডাল", slug: "dal", icon: "🫘" },
  { name: "তেল", slug: "tel", icon: "🫗" },
  { name: "সবজি", slug: "sobji", icon: "🥬" },
  { name: "মাছ", slug: "mach", icon: "🐟" },
  { name: "মাংস", slug: "mangsho", icon: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dudh", icon: "🥚" },
  { name: "মসলা", slug: "moshla", icon: "🌶️" },
];

const tickerItems = [
  { name: "মোটা চাল", price: "৫৮", change: "+১.৫%", up: true },
  { name: "মিনিকেট চাল", price: "৬৯", change: "-২.৯%", up: false },
  { name: "বাছাই সরু চাল", price: "৮৬", change: "+০.৫%", up: true },
  { name: "মসুর ডাল", price: "১৪২", change: "+২.৯%", up: true },
  { name: "ভোজ্য তেল", price: "১৭০", change: "-১.৮%", up: false },
  { name: "আমন চাল", price: "৬২", change: "+০.৮%", up: true },
];

function useBanglaDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setDate(
        new Intl.DateTimeFormat("bn-BD", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Dhaka",
        }).format(new Date()),
      );
    };

    updateDate();
    const timer = setInterval(updateDate, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return date;
}

export default function Navbar() {
  const banglaDate = useBanglaDate();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e6ebe4] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top row */}
        <div className="flex min-h-[64px] items-center justify-between gap-4 py-2">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <img
              src="/logo-icon.png"
              alt="বাজার দর"
              className="h-10 w-10 rounded-xl object-contain"
            />

            <div>
              <h1 className="text-xl font-bold leading-tight text-[#267747]">
                বাজার দর
              </h1>
              <p className="text-[10px] leading-4 text-[#778177]">
                {banglaDate}
              </p>
            </div>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/signin"
              className="rounded-md border border-[#e3e9e1] px-3 py-2 text-xs font-semibold text-[#26362b] hover:bg-[#f2f7f0]"
            >
              সাইন ইন
            </Link>

            <Link
              href="/signup"
              className="rounded-md bg-[#078b43] px-3 py-2 text-xs font-semibold !text-white hover:bg-[#067638]"
            >
              সাইন আপ
            </Link>
          </div>
        </div>

        {/* Category row: aligned with the logo/brand column */}
        <nav className="border-t border-[#f0f2ed]">
          <div className="flex items-center gap-1 overflow-x-auto py-1 sm:gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex shrink-0 items-center gap-1 rounded-md px-2 py-2 text-xs font-medium text-[#344238] transition hover:bg-[#edf5e9] hover:text-[#267747]"
              >
                <span aria-hidden="true">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Animated ticker */}
      <div className="overflow-hidden border-t border-[#e9eee5] bg-[#f0f6ed] py-1.5">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex shrink-0 items-center gap-1.5 px-4 text-xs"
            >
              <span>🌾</span>
              <span className="font-medium text-[#344238]">{item.name}</span>
              <span className="font-semibold text-[#344238]">
                {item.price} টাকা/কেজি
              </span>
              <span
                className={
                  item.up
                    ? "font-semibold text-[#d94c4c]"
                    : "font-semibold text-[#218653]"
                }
              >
                {item.up ? "▲" : "▼"} {item.change}
              </span>
              <span className="ml-2 text-[#cbd8c7]">•</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
