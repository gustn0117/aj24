const TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";

async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return text;

  try {
    const url = `${TRANSLATE_URL}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!res.ok) return text;

    const data = await res.json();
    // Response format: [[["translated","original",null,null,10]],null,"ko"]
    if (Array.isArray(data) && Array.isArray(data[0])) {
      return data[0].map((s: string[]) => s[0]).join("");
    }
    return text;
  } catch {
    return text;
  }
}

export async function koToCn(text: string): Promise<string> {
  return translateText(text, "ko", "zh-CN");
}

export async function cnToKo(text: string): Promise<string> {
  return translateText(text, "zh-CN", "ko");
}

export async function batchCnToKo(texts: string[]): Promise<string[]> {
  if (texts.length === 0) return [];

  // Join with delimiter, translate in one request, then split
  const DELIMITER = " ||| ";
  const joined = texts.join(DELIMITER);

  try {
    const translated = await translateText(joined, "zh-CN", "ko");
    const parts = translated.split("|||").map((s) => s.trim());

    // If split count matches, return parts; otherwise return original texts
    if (parts.length === texts.length) {
      return parts;
    }

    // Fallback: translate individually
    return Promise.all(texts.map((t) => cnToKo(t)));
  } catch {
    return texts;
  }
}
