import "./globals.css";
import Navbar from "../components/Navbar";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "বাজার দর | প্রতিদিনের বাজারের দাম",
  description:
    "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বর্তমান বাজারদর, দাম বৃদ্ধি ও হ্রাসের তথ্য এক জায়গায় দেখুন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="flex min-h-screen flex-col antialiased">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <main className="flex-1">{children}</main>

        <footer className="mt-auto border-t border-[#e6ebe4] bg-[#fafcf9] px-4 py-5">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center text-xs text-[#536055] sm:flex-row sm:text-left">
            <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>

            <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
          </div>
        </footer>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            success: {
              style: {
                background: "#e8f3e9",
                color: "#218653",
                border: "1px solid #218653",
                fontWeight: "600",
              },
              iconTheme: {
                primary: "#218653",
                secondary: "#ffffff",
              },
            },
            error: {
              style: {
                background: "#fff0f0",
                color: "#c62828",
                border: "1px solid #c62828",
                fontWeight: "600",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
