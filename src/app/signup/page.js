"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "../../lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এবার সাইন ইন করুন।");
      router.push("/signin");
    } catch {
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider) {
    setSocialLoading(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result?.error) {
        toast.error(result.error.message || "Social login শুরু করা যায়নি।");
        setSocialLoading("");
      }
    } catch {
      toast.error("Social login শুরু করা যায়নি।");
      setSocialLoading("");
    }
  }

  const inputClass =
    "w-full rounded-md border border-[#e1e8df] bg-transparent px-3 py-2.5 text-sm text-[#26362b] placeholder:text-[#9aa69b] outline-none transition focus:border-[#078b43] focus:ring-1 focus:ring-[#078b43]/20";

  const labelClass =
    "mb-1 block text-xs font-semibold text-[#202820] sm:text-sm";

  const socialButtonClass =
    "flex h-10 min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[#e1e8df] bg-[#fbfdfb] px-1.5 text-[10px] font-bold leading-none text-[#202020] transition hover:border-[#cbd8c9] hover:bg-[#f0f6ef] disabled:cursor-not-allowed disabled:opacity-60 sm:gap-2 sm:px-2 sm:text-xs";

  return (
    <main className="min-h-[calc(100vh-220px)] bg-[#f0f6ef] px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-md">
        <header className="mb-5 text-center">
          <h1 className="text-2xl font-bold text-[#202820]">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="mt-2 text-sm text-[#778177]">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </header>

        <section className="rounded-xl border border-[#e3e9e1] bg-[#fbfdfb] p-5 sm:p-6">
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label htmlFor="name" className={labelClass}>
                নাম
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: রহিম উদ্দিন"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                ইমেইল
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                পাসওয়ার্ড
              </label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelClass}>
                পাসওয়ার্ড নিশ্চিত করুন
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="আবার লিখুন"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="w-full rounded-md bg-[#078b43] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#067638] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#e1e7df]" />

            <span className="text-xs font-medium text-[#536057]">অথবা</span>

            <div className="h-px flex-1 bg-[#e1e7df]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading || !!socialLoading}
              className={socialButtonClass}
            >
              <FcGoogle size={16} className="shrink-0" aria-hidden="true" />

              <span>
                {socialLoading === "google"
                  ? "অপেক্ষা করুন..."
                  : "Google দিয়ে চালিয়ে যান"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              disabled={loading || !!socialLoading}
              className={socialButtonClass}
            >
              <FaGithub
                size={15}
                className="shrink-0 text-[#202020]"
                aria-hidden="true"
              />

              <span>
                {socialLoading === "github"
                  ? "অপেক্ষা করুন..."
                  : "GitHub দিয়ে চালিয়ে যান"}
              </span>
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-[#536057] sm:text-sm">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-bold text-[#078b43] hover:text-[#056b32] hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </section>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-[#778177] transition hover:text-[#078b43]"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
