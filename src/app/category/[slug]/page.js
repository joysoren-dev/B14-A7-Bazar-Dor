"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "https://api.abcz.workers.dev/api/bazardor/products";

const categories = {
  chal: { name: "চাল", icon: "🍚", apiSlug: "chal" },
  dal: { name: "ডাল", icon: "🫘", apiSlug: "dal" },
  tel: { name: "তেল", icon: "🫗", apiSlug: "tel" },
  sobji: { name: "সবজি", icon: "🥬", apiSlug: "sobji" },
  mach: { name: "মাছ", icon: "🐟", apiSlug: "mach" },
  mangsho: { name: "মাংস", icon: "🍗", apiSlug: "mangsho" },
  "dim-dudh": {
    name: "ডিম-দুধ",
    icon: "🥚",
    apiSlug: "dim-dui",
  },
  moshla: { name: "মসলা", icon: "🌶️", apiSlug: "mosla" },
};

function formatPrice(price) {
  return Number(price ?? 0).toLocaleString("bn-BD");
}

function getUnit(unit) {
  const units = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    gram: "গ্রাম",
  };

  return units[unit] || unit || "একক";
}

function getProductVisual(product, categoryIcon) {
  const visual = product.image || product.icon || product.emoji;

  if (typeof visual === "string" && visual.trim()) {
    return visual;
  }

  return categoryIcon || product.categoryIcon || "🛒";
}

function ProductCard({ product, categoryIcon }) {
  const change = Number(product.change?.pct ?? 0);
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const visual = getProductVisual(product, categoryIcon);

  const isImage =
    typeof visual === "string" &&
    (visual.startsWith("http://") ||
      visual.startsWith("https://") ||
      visual.startsWith("/"));

  return (
    <Link
      href={`/product/${product.slug}`}
      aria-label={`${product.nameBn}, বিস্তারিত দাম দেখুন`}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#e3ebe2] bg-[#fbfdfb] p-3 transition hover:border-[#b7d7bd] hover:shadow-sm sm:gap-4 sm:p-4"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f5ef] text-2xl sm:h-14 sm:w-14 sm:text-3xl">
        {isImage ? (
          <img
            src={visual}
            alt={product.nameBn || "পণ্যের ছবি"}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{visual}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="break-words text-sm font-bold leading-6 text-[#26362b] group-hover:text-[#267747] sm:text-base">
          {product.nameBn}
        </h2>

        <p className="mt-0.5 break-words text-[11px] leading-5 text-[#7a857b] sm:text-xs">
          প্রতি {getUnit(product.unit)}
        </p>

        <p className="mt-2 text-[10px] text-[#778177] sm:mt-3">আজকের বাজারদর</p>

        <p className="mt-0.5 break-words text-sm font-bold text-[#26362b] sm:text-base">
          {formatPrice(product.today)} টাকা
        </p>
      </div>

      <span
        className={`max-w-[90px] shrink-0 self-center whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold sm:max-w-none sm:self-end sm:text-xs ${
          isUp
            ? "bg-[#fff0ef] text-[#dc4545]"
            : isDown
              ? "bg-[#eaf7ed] text-[#16834a]"
              : "bg-[#edf1ed] text-[#667168]"
        }`}
      >
        {isUp ? "▲" : isDown ? "▼" : "—"} {formatPrice(Math.abs(change))}%
      </span>
    </Link>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex min-w-0 animate-pulse items-center gap-3 rounded-xl border border-[#e3ebe2] bg-[#fbfdfb] p-3 sm:gap-4 sm:p-4">
      <div className="h-12 w-12 shrink-0 rounded-xl bg-[#e7eee5] sm:h-14 sm:w-14" />

      <div className="min-w-0 flex-1">
        <div className="h-3 w-3/4 rounded bg-[#e7eee5]" />
        <div className="mt-2 h-2 w-1/3 rounded bg-[#e7eee5]" />
        <div className="mt-4 h-3 w-1/2 rounded bg-[#e7eee5]" />
      </div>
    </div>
  );
}

function CategoryContent({ slug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState("default");
  const [retry, setRetry] = useState(0);

  const category = categories[slug];

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("পণ্য লোড করা যায়নি");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("API থেকে সঠিক পণ্যের তালিকা পাওয়া যায়নি");
        }

        const filteredProducts = data.filter(
          (product) => product.category === category.apiSlug,
        );

        if (!cancelled) {
          setProducts(filteredProducts);
        }
      } catch (err) {
        console.error("Category products error:", err);

        if (!cancelled) {
          setError(true);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (category) {
      fetchProducts();
    } else {
      setProducts([]);
      setError(false);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [slug, category?.apiSlug, retry]);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = Number(a.today ?? 0);
    const priceB = Number(b.today ?? 0);

    if (sort === "low-high") return priceA - priceB;
    if (sort === "high-low") return priceB - priceA;

    return 0;
  });

  if (!category) {
    return (
      <section className="mx-auto flex min-h-[55vh] w-full max-w-5xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6">
        <span className="text-5xl" aria-hidden="true">
          🔎
        </span>

        <h1 className="mt-4 break-words text-xl font-bold text-[#26362b] sm:text-2xl">
          ক্যাটাগরি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#778177]">
          অনুগ্রহ করে সঠিক ক্যাটাগরি নির্বাচন করুন।
        </p>

        <Link
          href="/"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#078b43] px-5 py-3 text-sm font-semibold text-white hover:bg-[#067638]"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[55vh] w-full max-w-6xl min-w-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      {/* Category heading */}
      <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e3ebe2] bg-[#fbfdfb] p-3 sm:gap-4 sm:px-5 sm:py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f0f5ef] text-2xl sm:h-12 sm:w-12 sm:text-3xl">
          {category.icon}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="break-words text-lg font-bold leading-7 text-[#26362b] sm:text-xl">
            {category.name}
          </h1>

          <p className="mt-1 break-words text-xs leading-5 text-[#7a857b] sm:text-sm">
            {loading
              ? "পণ্যের তথ্য লোড হচ্ছে..."
              : `${formatPrice(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}
          </p>
        </div>
      </div>

      {/* Sorting controls */}
      <div className="mt-4 flex min-w-0 flex-col gap-2 rounded-xl border border-[#e3ebe2] bg-[#fbfdfb] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-xs leading-5 text-[#778177] sm:text-sm">
          {loading
            ? "পণ্য লোড হচ্ছে..."
            : `মোট ${formatPrice(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে`}
        </p>

        <div className="flex min-w-0 items-center gap-2 sm:shrink-0">
          <label
            htmlFor="product-sort"
            className="shrink-0 text-xs text-[#778177] sm:text-sm"
          >
            সাজান
          </label>

          <select
            id="product-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="min-h-10 min-w-0 flex-1 rounded-lg border border-[#dce5db] bg-white px-2 py-2 text-xs text-[#344238] outline-none focus:border-[#078b43] sm:flex-none sm:text-sm"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Product list */}
      <div className="mt-4">
        {loading ? (
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[#e3ebe2] bg-[#fbfdfb] px-4 py-10 text-center sm:py-12">
            <p className="text-sm font-semibold leading-6 text-[#a33b36]">
              পণ্যের তথ্য লোড করা যায়নি।
            </p>

            <button
              type="button"
              onClick={() => setRetry((current) => current + 1)}
              className="mt-4 min-h-11 rounded-lg bg-[#078b43] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#067638]"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="rounded-xl border border-[#e3ebe2] bg-[#fbfdfb] px-4 py-10 text-center sm:py-12">
            <span className="text-4xl" aria-hidden="true">
              🛒
            </span>

            <h2 className="mt-3 break-words text-base font-bold text-[#26362b] sm:text-lg">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#778177] sm:text-sm">
              অন্য ক্যাটাগরি থেকে পণ্য খুঁজে দেখতে পারেন।
            </p>

            <Link
              href="/"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#078b43] px-5 py-2.5 text-sm font-semibold text-white"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id ?? product.slug}
                product={product}
                categoryIcon={category.icon}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function CategoryPage({ params }) {
  return (
    <Suspense
      fallback={<div className="min-h-[55vh] animate-pulse bg-[#f0f5f0]" />}
    >
      <CategoryRoute params={params} />
    </Suspense>
  );
}

function CategoryRoute({ params }) {
  const { slug } = use(params);

  return <CategoryContent slug={slug} />;
}
