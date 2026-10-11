"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "../../lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

function getRedirectPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  const params = new URLSearchParams(window.location.search);
  const callbackURL = params.get("callbackURL");

  // Nijer site-er relative path chara onno URL allow kortesi
  if (
    callbackURL &&
    callbackURL.startsWith("/") &&
    !callbackURL.startsWith("//")
  ) {
    return callbackURL;
  }

  return "/";
}

export default function SigninPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  function handleBanglaValidation(e) {
    const input = e.currentTarget;

    if (input.validity.valueMissing) {
      input.setCustomValidity("এই ঘরটি পূরণ করুন।");
    } else if (input.validity.typeMismatch && input.type === "email") {
      input.setCustomValidity("সঠিক ইমেইল ঠিকানা লিখুন।");
    } else {
      input.setCustomValidity("");
    }
  }

  function clearBanglaValidation(e) {
    e.currentTarget.setCustomValidity("");
  }

  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "সাইন ইন করা যায়নি।");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে!");

      router.replace(getRedirectPath());
      router.refresh();
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider) {
    if (loading || socialLoading) return;

    setSocialLoading(provider);

    try {
      const result = await signIn.social({
        provider,
        callbackURL: getRedirectPath(),
        errorCallbackURL: "/signin",
      });

      if (result?.error) {
        toast.error(result.error.message || "Social login শুরু করা যায়নি।");
        setSocialLoading("");
      }
    } catch (error) {
      console.error("Social login error:", error);
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
          <h1 className="text-2xl font-bold text-[#202820]">সাইন ইন করুন</h1>

          <p className="mt-2 text-sm text-[#778177]">
            আপনার অ্যাকাউন্টে লগইন করে সব বিস্তারিত দাম দেখুন।
          </p>
        </header>

        <section className="rounded-xl border border-[#e3e9e1] bg-[#fbfdfb] p-5 sm:p-6">
          <form onSubmit={handleSignin} className="space-y-3">
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
                onInvalid={handleBanglaValidation}
                onInput={clearBanglaValidation}
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onInvalid={handleBanglaValidation}
                onInput={clearBanglaValidation}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!socialLoading}
              className="w-full rounded-md bg-[#078b43] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#067638] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}
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
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="font-bold !text-[#078b43] hover:!text-[#056b32] hover:underline"
            >
              সাইন আপ করুন
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
