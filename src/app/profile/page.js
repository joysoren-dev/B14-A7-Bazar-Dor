"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, updateUser, signOut } from "../../lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  async function handleUpdate(e) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    if (trimmedName === user?.name) {
      toast("নামে কোনো পরিবর্তন করা হয়নি।");
      return;
    }

    setSaving(true);

    try {
      const result = await updateUser({ name: trimmedName });

      if (result?.error) {
        toast.error(result.error.message || "নাম আপডেট করা যায়নি।");
        return;
      }

      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      router.refresh();
    } catch {
      toast.error("প্রোফাইল আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const result = await signOut();

      if (result?.error) {
        toast.error("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success("সফলভাবে লগআউট হয়েছে!");
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("লগআউট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoggingOut(false);
    }
  }

  if (isPending || !user) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-[#f0f6ef] px-4">
        <p className="text-sm text-[#778177]">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  const avatarLetter = (user.name || user.email || "U")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <main className="min-h-[calc(100vh-220px)] bg-[#f0f6ef] px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-[540px]">
        {/* Profile heading */}
        <header className="mb-5">
          <h2 className="text-xl font-bold text-[#202820]">আমার প্রোফাইল</h2>
          <p className="mt-1 text-xs text-[#778177]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </header>

        {/* User information card */}
        <section className="mb-5 flex flex-col gap-4 rounded-xl border border-[#e3e9e1] bg-[#fbfdfb] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt="প্রোফাইল ছবি"
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e5f4e9] text-xl font-bold text-[#078b43]">
                {avatarLetter}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[#26362b] sm:text-base">
                {user.name || "ব্যবহারকারী"}
              </h3>
              <p className="mt-1 break-all text-xs text-[#778177] sm:text-sm">
                {user.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="shrink-0 self-start rounded-md border border-[#e85b5b] px-3 py-2 text-xs font-semibold text-[#d94c4c] transition hover:bg-[#fff0f0] disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
          >
            {loggingOut ? "লগআউট হচ্ছে..." : "↶ সাইন আউট"}
          </button>
        </section>

        {/* Update information card */}
        <section className="rounded-xl border border-[#e3e9e1] bg-[#fbfdfb] p-5 sm:p-7">
          <h3 className="mb-7 text-sm font-bold text-[#26362b]">তথ্য</h3>

          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-xs font-medium text-[#344238]"
              >
                নাম
              </label>

              <input
                id="profile-name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-md border border-[#e1e8df] bg-transparent px-3 py-2.5 text-sm text-[#26362b] outline-none transition focus:border-[#078b43] focus:ring-1 focus:ring-[#078b43]/20"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="w-full rounded-md bg-[#078b43] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#067638] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
