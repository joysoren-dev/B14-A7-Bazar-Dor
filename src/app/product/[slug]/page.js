"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";

const API_URL = "https://api.api-store.workers.dev/api/bazardor/products";

function formatPrice(price) {
  return Number(price || 0).toLocaleString("bn-BD");
}

function formatMoney(price) {
  return `${formatPrice(price)} টাকা`;
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

function getShortUnit(unit) {
  const units = {
    kg: "কেজি",
    dozen: "ডজন",
    litre: "লিটার",
    piece: "পিস",
    gram: "গ্রাম",
  };

  return units[unit] || unit;
}

export default function ProductDetails({ params }) {
  const { slug } = use(params);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য পাওয়া যায়নি।");
        }

        const data = await response.json();
        const foundProduct = data.find((item) => item.slug === slug);

        if (!foundProduct) {
          setError("এই পণ্যটি খুঁজে পাওয়া যায়নি।");
          return;
        }

        setProduct(foundProduct);
      } catch (err) {
        console.error("Product details error:", err);
        setError("পণ্যের তথ্য লোড করা যায়নি।");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-16 text-center text-[#68756b]">
        পণ্যের তথ্য লোড হচ্ছে...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#e0e9e0] bg-[#fafcfb] p-8 text-center">
          <p className="font-semibold text-[#26352b]">
            {error || "পণ্য পাওয়া যায়নি"}
          </p>

          <Link
            href="/"
            className="mt-4 inline-block font-medium text-[#078b43] hover:underline"
          >
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  // দাম বাড়লে লাল, কমলে সবুজ এবং অপরিবর্তিত থাকলে ধূসর
  const changeColor = isUp
    ? "text-[#dc4545]"
    : isDown
      ? "text-[#078b43]"
      : "text-[#68756b]";

  const changeLabel = isUp ? "বেড়েছে" : isDown ? "কমেছে" : "অপরিবর্তিত";

  const marketPrices = (product.markets || []).map((market) => ({
    ...market,
    average: (Number(market.min) + Number(market.max)) / 2,
  }));

  const allPrices = marketPrices.flatMap((market) => [
    Number(market.min),
    Number(market.max),
  ]);

  const minimumPrice = allPrices.length
    ? Math.min(...allPrices)
    : Number(product.today);

  const maximumPrice = allPrices.length
    ? Math.max(...allPrices)
    : Number(product.today);

  const averagePrice = allPrices.length
    ? allPrices.reduce((total, price) => total + price, 0) / allPrices.length
    : Number(product.today);

  const changePercentage = formatPrice(
    Math.abs(Number(product.change?.pct || 0)),
  );

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#526257] sm:text-sm">
          <Link href="/" className="hover:text-[#078b43]">
            হোম
          </Link>

          <span>›</span>

          <span>{product.categoryNameBn}</span>

          <span>›</span>

          <span className="font-medium text-[#26352b]">{product.nameBn}</span>
        </nav>

        {/* Product summary */}
        <section className="flex flex-col gap-5 rounded-2xl border border-[#e0e9e0] bg-[#fafcfb] p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eff4ee] text-3xl sm:h-20 sm:w-20">
            {product.image || product.categoryIcon || "🛒"}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-[#26352b] sm:text-2xl">
              {product.nameBn}
            </h1>

            <p className="mt-1 text-sm text-[#68756b]">
              {getUnit(product.unit)} · {product.categoryNameBn}
            </p>

            <p className="mt-2 text-sm text-[#526257]">
              গতকালের তুলনায় আজ দাম{" "}
              <span className={`font-semibold ${changeColor}`}>
                {changeLabel}
              </span>
              {" · "}
              <span className={`font-semibold ${changeColor}`}>
                {isUp ? "▲" : isDown ? "▼" : "—"} {changePercentage}%
              </span>
            </p>
          </div>

          {/* Today's price */}
          <div className="flex min-w-[130px] flex-col items-start rounded-xl bg-[#eff4ee] px-4 py-3 sm:items-center">
            <span className="text-xs text-[#68756b]">আজকের দাম</span>

            <strong className="mt-1 text-2xl font-bold text-[#26352b]">
              {formatPrice(product.today)}
            </strong>

            <span className="text-xs text-[#68756b]">
              টাকা / {getShortUnit(product.unit)}
            </span>

            <span className={`mt-1 text-xs font-semibold ${changeColor}`}>
              {isUp ? "▲" : isDown ? "▼" : "—"} {changePercentage}%
            </span>
          </div>
        </section>

        {/* Price summary and market table */}
        <section className="mt-4 rounded-2xl border border-[#e0e9e0] bg-[#fafcfb] p-4 sm:p-5">
          <h2 className="mb-3 text-base font-bold text-[#26352b]">
            দামের সারসংক্ষেপ
          </h2>

          {/* Minimum, maximum and average prices */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e0e9e0] p-4">
              <p className="text-xs text-[#526257]">সর্বনিম্ন দাম</p>

              <p className="mt-1 text-xl font-bold text-[#078b43]">
                {formatMoney(minimumPrice)}
              </p>

              <p className="mt-1 text-xs text-[#68756b]">
                সব বাজারের মধ্যে সর্বনিম্ন
              </p>
            </div>

            <div className="rounded-xl border border-[#e0e9e0] p-4">
              <p className="text-xs text-[#526257]">সর্বোচ্চ দাম</p>

              <p className="mt-1 text-xl font-bold text-[#dc4545]">
                {formatMoney(maximumPrice)}
              </p>

              <p className="mt-1 text-xs text-[#68756b]">
                সব বাজারের মধ্যে সর্বোচ্চ
              </p>
            </div>

            <div className="rounded-xl border border-[#e0e9e0] p-4">
              <p className="text-xs text-[#526257]">গড় দাম</p>

              <p className="mt-1 text-xl font-bold text-[#26352b]">
                {formatMoney(Math.round(averagePrice))}
              </p>

              <p className="mt-1 text-xs text-[#68756b]">
                সব বাজারের min ও max-এর গড়
              </p>
            </div>
          </div>

          {/* Market-wise prices */}
          <h2 className="mb-3 mt-6 text-base font-bold text-[#26352b]">
            বাজারভিত্তিক আজকের দাম
          </h2>

          <div className="overflow-x-auto rounded-xl border border-[#e0e9e0]">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead className="bg-[#f0f5f0] text-[#526257]">
                <tr>
                  <th className="px-3 py-3 font-medium">বাজার</th>

                  <th className="px-3 py-3 font-medium">বিভাগ</th>

                  <th className="px-3 py-3 font-medium">সর্বনিম্ন</th>

                  <th className="px-3 py-3 font-medium">সর্বোচ্চ</th>

                  <th className="px-3 py-3 text-right font-medium">গড়</th>
                </tr>
              </thead>

              <tbody>
                {marketPrices.map((market, index) => (
                  <tr
                    key={`${market.market}-${index}`}
                    className={
                      index % 2 === 0
                        ? "border-t border-[#e0e9e0] bg-[#fafcfb]"
                        : "border-t border-[#e0e9e0] bg-[#f0f5f0]"
                    }
                  >
                    <td className="px-3 py-3 text-[#26352b]">
                      {market.market}
                    </td>

                    <td className="px-3 py-3 text-[#526257]">
                      {market.division}
                    </td>

                    <td className="px-3 py-3 text-[#26352b]">
                      {formatMoney(market.min)}
                    </td>

                    <td className="px-3 py-3 text-[#26352b]">
                      {formatMoney(market.max)}
                    </td>

                    <td className="px-3 py-3 text-right font-semibold text-[#26352b]">
                      {formatMoney(Math.round(market.average))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
