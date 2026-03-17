let cachedRate: { rate: number; fetchedAt: number } | null = null;
const FALLBACK_RATE = 190; // approximate CNY to KRW
const CACHE_DURATION = 3600000; // 1 hour

export async function getCNYtoKRWRate(): Promise<number> {
  if (cachedRate && Date.now() - cachedRate.fetchedAt < CACHE_DURATION) {
    return cachedRate.rate;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/CNY", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return FALLBACK_RATE;

    const data = await res.json();
    const rate = data?.rates?.KRW;

    if (typeof rate === "number" && rate > 0) {
      cachedRate = { rate, fetchedAt: Date.now() };
      return rate;
    }

    return FALLBACK_RATE;
  } catch {
    return FALLBACK_RATE;
  }
}

export function convertCNYtoKRW(cny: number, rate: number): number {
  return Math.round((cny * rate) / 100) * 100; // round to nearest 100
}
