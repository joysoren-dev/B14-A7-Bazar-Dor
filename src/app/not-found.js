import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f0f5f0] px-4 text-center">
      <p className="text-6xl font-bold text-[#078b43]">404</p>

      <h1 className="mt-5 text-3xl font-bold text-[#26352b]">
        পেজটি খুঁজে পাওয়া যায়নি!
      </h1>

      <p className="mt-4 text-[#68756b]">
        আপনি যে পেজটি খুঁজছেন সেটি এখানে নেই।
      </p>

      <Link
        href="/"
        className="mt-7 rounded-xl bg-[#078b43] px-6 py-3 font-semibold text-white hover:bg-[#066f36]"
      >
        ← হোমপেজে ফিরে যান
      </Link>
    </main>
  );
}
