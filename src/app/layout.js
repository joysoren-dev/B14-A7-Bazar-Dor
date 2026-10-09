import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "বাজার দর | প্রতিদিনের বাজারের দাম",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর, দাম বৃদ্ধি ও হ্রাসের তথ্য এক জায়গায় দেখুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />

        <main className="flex-1">{children}</main>

        <footer className="mt-auto border-t border-[#e6ebe4] bg-[#fafcf9] px-4 py-5">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center text-xs text-[#536055] sm:flex-row sm:text-left">
            <p>বাজার দর — প্রতিদিনের বাজারদর, এক নজরে।</p>

            <p>সকল দাম সর্বশেষ; বাজার অবস্থার উপর নির্ভর করে পরিবর্তিত হয়।</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
