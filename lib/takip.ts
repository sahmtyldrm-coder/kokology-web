/**
 * TRAFİK SINIFLANDIRMA
 *
 * Yapay zekâ görünürlüğü iki farklı şeyle ölçülür ve ikisi karıştırılmamalı:
 *
 *   1. YAPAY ZEKÂDAN GELEN ZİYARET — kullanıcı ChatGPT'ye sordu, cevapta
 *      sitemiz çıktı, tıkladı. `referrer` alanından anlaşılır.
 *   2. YAPAY ZEKÂ TARAMASI — modelin tarayıcısı içeriğimizi çekti.
 *      `user-agent` alanından anlaşılır. Ziyaret değildir.
 *
 * "Kaç yapay zekâ sorgusunda çıktık" sorusunun cevabı hiçbir yerde YOK —
 * sağlayıcılar sorgu hacmi paylaşmıyor. Bu iki ölçüm gerçek görünürlük
 * eğrisi verir; sorgu sayısı vermez ve öyle sunulmamalı.
 */

/** Referrer'a göre yapay zekâ kaynakları */
const YAPAY_ZEKA_KAYNAKLARI: Record<string, string> = {
  "chatgpt.com": "ChatGPT",
  "chat.openai.com": "ChatGPT",
  "openai.com": "ChatGPT",
  "perplexity.ai": "Perplexity",
  "gemini.google.com": "Gemini",
  "bard.google.com": "Gemini",
  "claude.ai": "Claude",
  "copilot.microsoft.com": "Copilot",
  "you.com": "You.com",
  "poe.com": "Poe",
};

const ARAMA_MOTORLARI = ["google.", "bing.", "yandex.", "duckduckgo.", "ecosia."];
const SOSYAL = ["instagram.", "facebook.", "t.co", "twitter.", "x.com", "tiktok.", "youtube.", "linkedin."];

export type Kaynak = {
  kaynak: "yapay_zeka" | "organik" | "sosyal" | "dogrudan" | "diger";
  kaynakAd: string;
};

export function kaynakBelirle(referrer: string, host: string): Kaynak {
  if (!referrer) return { kaynak: "dogrudan", kaynakAd: "" };

  let alan = "";
  try {
    alan = new global.URL(referrer).hostname.toLowerCase();
  } catch {
    return { kaynak: "diger", kaynakAd: "" };
  }

  // Site içi gezinme trafik kaynağı değildir
  if (alan === host.toLowerCase()) return { kaynak: "dogrudan", kaynakAd: "" };

  for (const [parca, ad] of Object.entries(YAPAY_ZEKA_KAYNAKLARI)) {
    if (alan.includes(parca)) return { kaynak: "yapay_zeka", kaynakAd: ad };
  }
  if (ARAMA_MOTORLARI.some((m) => alan.includes(m)))
    return { kaynak: "organik", kaynakAd: alan };
  if (SOSYAL.some((m) => alan.includes(m)))
    return { kaynak: "sosyal", kaynakAd: alan };

  return { kaynak: "diger", kaynakAd: alan };
}

/* -------------------------------------------------------------------------- */

/** User-agent'a göre yapay zekâ tarayıcıları */
const YAPAY_ZEKA_BOTLARI: Record<string, string> = {
  gptbot: "GPTBot",
  "oai-searchbot": "OAI-SearchBot",
  "chatgpt-user": "ChatGPT-User",
  perplexitybot: "PerplexityBot",
  "perplexity-user": "Perplexity-User",
  claudebot: "ClaudeBot",
  "claude-searchbot": "Claude-SearchBot",
  "claude-user": "Claude-User",
  "google-extended": "Google-Extended",
  "applebot-extended": "Applebot-Extended",
  bytespider: "Bytespider",
  amazonbot: "Amazonbot",
  "meta-externalagent": "Meta-ExternalAgent",
  ccbot: "CCBot",
  cohere: "Cohere",
};

export function botBelirle(userAgent: string): { bot: boolean; botAd: string } {
  const ua = userAgent.toLowerCase();
  for (const [parca, ad] of Object.entries(YAPAY_ZEKA_BOTLARI)) {
    if (ua.includes(parca)) return { bot: true, botAd: ad };
  }
  return { bot: false, botAd: "" };
}
