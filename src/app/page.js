"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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

function formatPrice(price) {
  return Number(price || 0).toLocaleString("bn-BD");
}

function getUnit(unit) {
  const units = {
    kg: "প্রতি কেজি",
    dozen: "প্রতি ডজন",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    gram: "প্রতি গ্রাম",
  };

  return units[unit] || `প্রতি ${unit}`;
}

function ProductCard({ product }) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const percentage = Math.abs(product.change?.pct || 0);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex min-w-0 flex-col rounded-2xl border border-[#e0e8df] bg-[#fafcfb] p-4 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff4ee] text-2xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[#26352b]">
            {product.nameBn}
          </h3>

          <p className="text-xs text-[#68756b]">{getUnit(product.unit)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-xs text-[#748074]">আজকের দাম</p>

          <p className="mt-0.5 font-bold text-[#26352b]">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

        {product.change && (
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
              isUp
                ? "bg-[#fff0ee] text-[#d94c4c]"
                : isDown
                  ? "bg-[#e7f5eb] text-[#218653]"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {isUp ? "▲" : isDown ? "▼" : "—"} {formatPrice(percentage)}%
          </span>
        )}
      </div>
    </Link>
  );
}

function ProductSection({ title, products, direction }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[#26352b] sm:text-2xl">
        <span
          className={direction === "down" ? "text-[#218653]" : "text-[#df4141]"}
        >
          {direction === "down" ? "▼" : "▲"}
        </span>

        {title}
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const banglaDate = useBanglaDate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://api.abcz.workers.dev/api/bazardor/products",
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("API থেকে সঠিক পণ্যের তালিকা পাওয়া যায়নি।");
        }

        setProducts(data);
      } catch (err) {
        console.error("Product API error:", err);
        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const risingProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => (a.change?.pct || 0) - (b.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="min-h-full bg-[#f0f5f0]">
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
        <div className="grid items-center gap-4 rounded-3xl border border-[#e0e9e0] bg-[#fafcfb] px-4 py-6 sm:px-8 sm:py-8 md:grid-cols-[1.5fr_0.8fr] md:px-4 lg:min-h-[258px]">
          <div>
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

      {loading ? (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="text-center text-[#68756b]">পণ্যের দাম লোড হচ্ছে...</p>
        </section>
      ) : error ? (
        <section className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-3 rounded-lg bg-[#078b43] px-4 py-2 text-white"
          >
            আবার চেষ্টা করুন
          </button>
        </section>
      ) : (
        <>
          <ProductSection
            title="আজ দাম বেড়েছে"
            products={risingProducts}
            direction="up"
          />

          <ProductSection
            title="আজ দাম কমেছে"
            products={fallingProducts}
            direction="down"
          />

          <section
            id="সব-পণ্য"
            className="mx-auto max-w-6xl scroll-mt-40 px-4 py-5 pb-12 sm:px-6"
          >
            <h2 className="mb-4 text-2xl font-bold text-[#26352b]">
              সব পণ্য ({products.length})
            </h2>

            {products.length === 0 ? (
              <p className="text-[#68756b]">
                বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি।
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
