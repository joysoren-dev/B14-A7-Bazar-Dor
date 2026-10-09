"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const risingProducts = [
  {
    name: "পেঁয়াজ",
    emoji: "🧅",
    unit: "প্রতি কেজি",
    price: "৫৪",
    change: "২.৫%",
  },
  { name: "আদা", emoji: "🫚", unit: "প্রতি কেজি", price: "৮৫", change: "১.৯%" },
  {
    name: "বেগুন",
    emoji: "🍆",
    unit: "প্রতি কেজি",
    price: "৪৪",
    change: "৪.৮%",
  },
  {
    name: "কই মাছ",
    emoji: "🐟",
    unit: "প্রতি কেজি",
    price: "৪৮০",
    change: "১.৫%",
  },
  { name: "ডিম", emoji: "🥚", unit: "প্রতি ডজন", price: "১৬৫", change: "০.৮%" },
  {
    name: "মাখন (১০০ গ্রাম)",
    emoji: "🧈",
    unit: "প্রতি পিস",
    price: "২৭৫",
    change: "০.৬%",
  },
];

const fallingProducts = [
  { name: "আলু", emoji: "🥔", unit: "প্রতি কেজি", price: "৩৫", change: "৩.০%" },
  { name: "শসা", emoji: "🥒", unit: "প্রতি কেজি", price: "৪০", change: "২.৫%" },
  {
    name: "পেঁপে",
    emoji: "🍈",
    unit: "প্রতি কেজি",
    price: "৪৫",
    change: "২.০%",
  },
  {
    name: "গাজর",
    emoji: "🥕",
    unit: "প্রতি কেজি",
    price: "৬০",
    change: "১.৮%",
  },
  { name: "কলা", emoji: "🍌", unit: "প্রতি ডজন", price: "৮০", change: "১.৫%" },
  {
    name: "লেবু",
    emoji: "🍋",
    unit: "প্রতি হালি",
    price: "৩০",
    change: "১.২%",
  },
];

const allProducts = [
  { name: "চাল", emoji: "🍚", unit: "প্রতি কেজি", price: "৬৫" },
  { name: "মসুর ডাল", emoji: "🫘", unit: "প্রতি কেজি", price: "১৩০" },
  { name: "সয়াবিন তেল", emoji: "🫗", unit: "প্রতি লিটার", price: "১৭৫" },
  { name: "পেঁয়াজ", emoji: "🧅", unit: "প্রতি কেজি", price: "৫৪" },
  { name: "আলু", emoji: "🥔", unit: "প্রতি কেজি", price: "৩৫" },
  { name: "ডিম", emoji: "🥚", unit: "প্রতি ডজন", price: "১৬৫" },
];

function useBanglaDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setDate(
        new Intl.DateTimeFormat("bn-BD", {
          weekday: "long",
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

function ProductCard({ product, falling = false }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.name)}`}
      className="flex min-w-0 flex-col rounded-2xl border border-[#e0e8df] bg-[#fafcfb] p-4 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff4ee] text-2xl">
          {product.emoji}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[#26352b]">
            {product.name}
          </h3>
          <p className="text-xs text-[#68756b]">{product.unit}</p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[#748074]">আজকের দাম</p>
          <p className="mt-0.5 font-bold text-[#26352b]">
            ৳{product.price} <span className="text-sm font-normal">টাকা</span>
          </p>
        </div>

        {product.change && (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              falling
                ? "bg-[#e7f5eb] text-[#218653]"
                : "bg-[#fff0ee] text-[#d94c4c]"
            }`}
          >
            {falling ? "▼" : "▲"} {product.change}
          </span>
        )}
      </div>
    </Link>
  );
}

function ProductSection({ title, products, falling = false }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#26352b] sm:text-2xl">
        <span className={falling ? "text-[#218653]" : "text-[#df4141]"}>
          {falling ? "▼" : "▲"}
        </span>
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.name} product={product} falling={falling} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const banglaDate = useBanglaDate();

  return (
    <div className="min-h-full bg-[#f0f5f0]">
      {/* Hero section */}
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        <div className="grid items-center gap-4 rounded-3xl border border-[#e0e9e0] bg-[#fafcfb] px-4 py-6 sm:px-8 sm:py-8 md:grid-cols-[1.5fr_0.8fr] md:px-4 lg:min-h-[258px]">
          <div>
            {/* Reference image-er moto date badge */}
            {banglaDate && (
              <p className="mb-3 inline-flex rounded-full bg-[#e1f2e7] px-3 py-1.5 text-xs font-medium text-[#168044]">
                {banglaDate}
              </p>
            )}

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#26352b] sm:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#69766c] sm:text-base sm:leading-7">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <Link
              href="#সব-পণ্য"
              className="mt-6 inline-flex items-center rounded-lg bg-[#078b43] px-5 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-[#067638]"
            >
              সব পণ্য দেখুন
            </Link>
          </div>

          <div className="relative mx-auto h-44 w-full max-w-[300px] sm:h-52 md:h-56">
            <Image
              src="/bazar-hero.png"
              alt="বাজারের তাজা পণ্যের ঝুড়ি"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      <ProductSection title="আজ দাম বেড়েছে" products={risingProducts} />

      <ProductSection title="আজ দাম কমেছে" products={fallingProducts} falling />

      <section
        id="সব-পণ্য"
        className="mx-auto max-w-6xl scroll-mt-40 px-4 py-5 pb-12 sm:px-6"
      >
        <h2 className="mb-4 text-2xl font-bold text-[#26352b]">সব পণ্য</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
