"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "../lib/auth-client";
import toast from "react-hot-toast";

const categories = [
  { name: "চাল", slug: "chal", icon: "🍚" },
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
    function updateDate() {
      setDate(
        new Intl.DateTimeFormat("bn-BD", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Dhaka",
        }).format(new Date()),
      );
    }

    updateDate();

    const timer = setInterval(updateDate, 60 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  return date;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const banglaDate = useBanglaDate();

  const { data: session, isPending } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  // Page change hole dropdown bondho kortesi
  useEffect(() => {
    setProfileOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const result = await signOut();

      if (result?.error) {
        toast.error("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      setProfileOpen(false);
      toast.success("সফলভাবে লগআউট হয়েছে!");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoggingOut(false);
    }
  }

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

          {/* Authentication area */}
          <div className="flex shrink-0 items-center gap-2">
            {isPending ? (
              <div
                className="h-9 w-20 animate-pulse rounded-md bg-[#edf2eb]"
                aria-label="অ্যাকাউন্টের তথ্য লোড হচ্ছে"
              />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="flex max-w-[190px] items-center gap-2 rounded-lg border border-[#e3e9e1] px-2.5 py-2 transition hover:bg-[#f2f7f0] sm:px-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e5f4e9] text-sm font-bold text-[#078b43]">
                    {(user.name || user.email || "U")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span className="max-w-[100px] truncate text-xs font-semibold text-[#26362b] sm:max-w-[130px] sm:text-sm">
                    {user.name || "আমার অ্যাকাউন্ট"}
                  </span>

                  <svg
                    className={`h-4 w-4 shrink-0 text-[#536055] transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 7.22a.75.75 0 011.06 0L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 8.28a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-[60] mt-2 w-64 overflow-hidden rounded-xl border border-[#e3e9e1] bg-white shadow-lg"
                  >
                    <div className="border-b border-[#edf1eb] px-4 py-3">
                      <p className="truncate text-sm font-bold text-[#26362b]">
                        {user.name || "ব্যবহারকারী"}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#778177]">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        role="menuitem"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#344238] transition hover:bg-[#edf5e9] hover:text-[#078b43]"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M5 21v-2a7 7 0 0114 0v2" />
                        </svg>
                        আমার প্রোফাইল
                      </Link>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#c0392b] transition hover:bg-[#fff0ed] disabled:opacity-60"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          aria-hidden="true"
                        >
                          <path d="M10 17l5-5-5-5M15 12H3" />
                          <path d="M12 3h6a2 2 0 012 2v14a2 2 0 01-2 2h-6" />
                        </svg>
                        {loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-md border border-[#e3e9e1] px-3 py-2 text-xs font-semibold text-[#26362b] hover:bg-[#f2f7f0]"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-md bg-[#078b43] px-3 py-2 text-xs font-semibold text-white hover:bg-[#067638]"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Category navigation */}
        <nav className="border-t border-[#f0f2ed]">
          <div className="flex items-center gap-1 overflow-x-auto py-1 sm:gap-2">
            {categories.map((category) => {
              const isActive = pathname === `/category/${category.slug}`;

              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#078b43] text-white"
                      : "text-[#344238] hover:bg-[#edf5e9] hover:text-[#267747]"
                  }`}
                >
                  <span aria-hidden="true">{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Animated price ticker */}
      <div className="overflow-hidden border-t border-[#e9eee5] bg-[#f0f6ed] py-1.5">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex shrink-0 items-center gap-1.5 px-4 text-xs"
            >
              <span aria-hidden="true">🌾</span>

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
