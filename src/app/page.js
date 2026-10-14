"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "https://api.abcz.workers.dev/api/bazardor/products";

function useBanglaDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    function updateDate() {
      setDate(
        new Intl.DateTimeFormat("bn-BD", {
          weekday: "long",
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

function formatPrice(price) {
  return Number(price ?? 0).toLocaleString("bn-BD");
}

function getUnit(unit) {
  const units = {
    kg: "প্রতি কেজি",
    dozen: "প্রতি ডজন",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    gram: "প্রতি গ্রাম",
  };

  return units[unit] || `প্রতি ${unit || "একক"}`;
}

function ProductVisual({ product }) {
  const visual = product.image || product.categoryIcon || product.icon || "🛒";

  const isImage =
    typeof visual === "string" &&
    (visual.startsWith("https://") ||
      visual.startsWith("http://") ||
      visual.startsWith("/"));

  if (isImage) {
    return (
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#eff4ee]">
        <Image
          src={visual}
          alt={product.nameBn || "পণ্যের ছবি"}
          fill
          sizes="48px"
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eff4ee] text-2xl">
      {visual}
    </div>
  );
}

function ProductCard({ product }) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const percentage = Math.abs(Number(product.change?.pct ?? 0));

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`${product.nameBn}, বিস্তারিত দাম দেখুন`}
      className="flex min-w-0 flex-col rounded-2xl border border-[#e0e8df] bg-[#fafcfb] p-3 transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        <ProductVisual product={product} />

        <div className="min-w-0 flex-1">
          <h3 className="break-words text-sm font-semibold leading-6 text-[#26352b] sm:text-base">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 break-words text-xs leading-5 text-[#68756b]">
            {getUnit(product.unit)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex min-w-0 flex-wrap items-end justify-between gap-2 border-t border-[#edf0eb] pt-3">
        <div className="min-w-0">
          <p className="text-xs text-[#748074]">আজকের দাম</p>
          <p className="mt-1 break-words text-sm font-bold leading-6 text-[#26352b] sm:text-base">
            {formatPrice(product.today)} টাকা
          </p>
        </div>

        {product.change && (
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
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
    <section className="mx-auto w-full max-w-6xl min-w-0 px-4 py-5 sm:px-6 sm:py-6">
      <h2 className="mb-4 flex min-w-0 items-start gap-2 text-lg font-bold leading-7 text-[#26352b] sm:text-2xl">
        <span
          className={`mt-0.5 shrink-0 ${
            direction === "down" ? "text-[#218653]" : "text-[#df4141]"
          }`}
          aria-hidden="true"
        >
          {direction === "down" ? "▼" : "▲"}
        </span>

        <span className="min-w-0 break-words">{title}</span>
      </h2>

      {products.length === 0 ? (
        <p className="rounded-xl border border-[#e0e8df] bg-[#fafcfb] p-4 text-sm leading-6 text-[#68756b] sm:p-5">
          বর্তমানে এই তালিকার জন্য কোনো তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id ?? product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="min-w-0 animate-pulse rounded-2xl border border-[#e0e8df] bg-[#fafcfb] p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-xl bg-[#e6ede4]" />

        <div className="min-w-0 flex-1">
          <div className="h-3 w-3/4 rounded bg-[#e6ede4]" />
          <div className="mt-2 h-2 w-1/3 rounded bg-[#e6ede4]" />
        </div>
      </div>

      <div className="mt-5 h-3 w-1/2 rounded bg-[#e6ede4]" />
    </div>
  );
}

export default function Home() {
  const banglaDate = useBanglaDate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(API_URL, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("API থেকে সঠিক পণ্যের তালিকা পাওয়া যায়নি।");
        }

        setProducts(data);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Product API error:", err);
        setError(true);
        setProducts([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [retry]);

  const risingProducts = [...products]
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => Number(b.change?.pct ?? 0) - Number(a.change?.pct ?? 0))
    .slice(0, 6);

  const fallingProducts = [...products]
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => Number(a.change?.pct ?? 0) - Number(b.change?.pct ?? 0))
    .slice(0, 6);

  return (
    <main className="w-full min-w-0 overflow-x-clip bg-[#f0f5f0]">
      {/* Hero section */}
      <section className="mx-auto w-full max-w-6xl min-w-0 px-3 py-4 sm:px-6 sm:py-6">
        <div className="grid w-full min-w-0 grid-cols-1 items-center gap-3 rounded-2xl border border-[#e0e9e0] bg-[#fafcfb] p-3 sm:gap-6 sm:rounded-3xl sm:p-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] lg:gap-8 lg:p-8">
          <div className="w-full min-w-0">
            {banglaDate && (
              <p className="mb-3 inline-flex max-w-full flex-wrap rounded-full bg-[#e1f2e7] px-3 py-1.5 text-xs font-medium leading-5 text-[#168044]">
                {banglaDate}
              </p>
            )}

            <h1 className="w-full min-w-0 break-words text-2xl font-bold leading-snug tracking-tight text-[#26352b] sm:text-4xl">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="mt-3 w-full min-w-0 break-words text-sm leading-6 text-[#69766c] sm:mt-4 sm:text-base sm:leading-7">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম—বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <Link
              href="#সব-পণ্য"
              className="mt-5 inline-flex min-h-11 max-w-full items-center justify-center rounded-lg bg-[#078b43] px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-[#067638] sm:mt-6 sm:px-5"
            >
              সব পণ্য দেখুন →
            </Link>
          </div>

          <div className="relative mx-auto h-36 w-full min-w-0 max-w-[240px] sm:h-52 sm:max-w-[280px] md:h-56">
            <Image
              src="/bazar-hero.png"
              alt="বাজারের তাজা পণ্যের ঝুড়ি"
              fill
              priority
              sizes="(max-width: 639px) 240px, (max-width: 767px) 280px, 35vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <section className="mx-auto w-full max-w-6xl min-w-0 px-4 py-5 sm:px-6">
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </section>
      ) : error ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-10 text-center sm:px-6 sm:py-12">
          <p className="text-sm leading-6 text-red-600">
            পণ্যের তথ্য লোড করা যায়নি।
          </p>

          <button
            type="button"
            onClick={() => setRetry((value) => value + 1)}
            className="mt-4 min-h-11 rounded-lg bg-[#078b43] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#067638]"
          >
            আবার চেষ্টা করুন
          </button>
        </section>
      ) : (
        <>
          <ProductSection
            title="আজ দাম বেড়েছে"
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
            className="mx-auto w-full max-w-6xl min-w-0 scroll-mt-44 px-4 py-5 pb-10 sm:scroll-mt-40 sm:px-6 sm:pb-12"
          >
            <h2 className="mb-4 break-words text-xl font-bold leading-8 text-[#26352b] sm:text-2xl">
              সব পণ্য ({formatPrice(products.length)})
            </h2>

            {products.length === 0 ? (
              <p className="rounded-xl border border-[#e0e8df] bg-[#fafcfb] p-4 text-sm leading-6 text-[#68756b]">
                বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি।
              </p>
            ) : (
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id ?? product.slug}
                    product={product}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
