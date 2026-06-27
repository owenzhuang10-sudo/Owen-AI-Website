#!/usr/bin/env node
/**
 * Daily data fetcher for AI News Hub. No API keys required.
 *
 *  - Models: authoritative quality scores from Artificial Analysis
 *            (the "Intelligence Index" leaderboard, + coding / benchmark
 *            sub-scores, org, country, release date). Parsed from the page's
 *            embedded JSON. Self-healing: if the fetch/parse ever fails or
 *            returns too few models, the previous models.json is kept.
 *
 *  - News:   pulled live from public AI RSS feeds, then auto-translated to
 *            Chinese. Translation failures fall back to the original text.
 *
 * Run: `node scripts/fetch-data.mjs [--only=news|models]`
 */

import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 AINewsHub/1.0";

async function readExisting(file) {
  try {
    return JSON.parse(await readFile(join(DATA_DIR, file), "utf8"));
  } catch {
    return null;
  }
}

// ============================ NEWS ============================

const FEEDS = [
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "MIT Tech Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed" },
  { name: "Ars Technica AI", url: "https://arstechnica.com/ai/feed/" },
  { name: "Google AI Blog", url: "https://blog.google/technology/ai/rss/" },
  { name: "The Verge AI", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
];

function decodeEntities(s = "") {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .trim();
}
const stripTags = (s = "") => decodeEntities(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1] : "";
}

// Pull a representative image URL out of an RSS/Atom item.
function extractImage(block) {
  const tries = [
    /<media:content[^>]*url=["']([^"']+)["'][^>]*medium=["']image["']/i,
    /<media:content[^>]*medium=["']image["'][^>]*url=["']([^"']+)["']/i,
    /<media:thumbnail[^>]*url=["']([^"']+)["']/i,
    /<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image\//i,
    /<enclosure[^>]*type=["']image\/[^"']*["'][^>]*url=["']([^"']+)["']/i,
    /<image>\s*<url>([^<]+)<\/url>/i,
    /<img[^>]+src=["']([^"']+)["']/i, // image embedded in description/content
  ];
  for (const re of tries) {
    const m = block.match(re);
    if (m && /^https?:\/\//i.test(m[1])) {
      return decodeEntities(m[1]);
    }
  }
  return null;
}

function parseFeed(xml, sourceName) {
  const items = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) || [];
  for (const block of blocks) {
    const title = stripTags(pick(block, "title"));
    if (!title) continue;
    let link = stripTags(pick(block, "link"));
    if (!link) {
      const href = block.match(/<link[^>]*href=["']([^"']+)["']/i);
      link = href ? href[1] : "";
    }
    const rawDate = pick(block, "pubDate") || pick(block, "published") || pick(block, "updated");
    const date = rawDate ? new Date(stripTags(rawDate)) : null;
    const summary = stripTags(
      pick(block, "description") || pick(block, "summary") || pick(block, "content")
    ).slice(0, 220);
    items.push({
      title, link, source: sourceName, summary,
      image: extractImage(block),
      publishedAt: date && !isNaN(date) ? date.toISOString() : null,
    });
  }
  return items;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = parseFeed(await res.text(), feed.name);
    console.log(`  ✓ ${feed.name}: ${items.length}`);
    return items;
  } catch (err) {
    console.warn(`  ✗ ${feed.name}: ${err.message}`);
    return [];
  }
}

// Brand / product names that must NOT be translated. Protected with ASCII
// sentinels (uppercase+digits survive MT untouched) and restored afterward.
const GLOSSARY = [
  "OpenAI", "Anthropic", "Claude", "ChatGPT", "GPT", "Gemini", "DeepMind",
  "Google", "Microsoft", "Meta", "Llama", "Mistral", "DeepSeek", "Qwen",
  "Alibaba", "Nvidia", "NVIDIA", "Hugging Face", "Sora", "Grok", "xAI",
  "Copilot", "Perplexity", "Midjourney", "Stability AI", "Cohere",
];

// Free, key-less translation (Google's public gtx endpoint). Cached + concurrency-limited.
const trCache = new Map();
async function translate(text) {
  const t = (text || "").trim();
  if (!t) return text;
  // Skip if already mostly Chinese.
  if ((t.match(/[一-鿿]/g) || []).length > t.length * 0.3) return text;
  if (trCache.has(t)) return trCache.get(t);

  // Shield glossary terms behind sentinels like "ZZQ3ZZ".
  const shield = [];
  let masked = t;
  for (const term of GLOSSARY) {
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    masked = masked.replace(re, () => {
      const token = `ZZQ${shield.length}ZZ`;
      shield.push(term);
      return token;
    });
  }

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=" +
      encodeURIComponent(masked.slice(0, 1500));
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    let zh = (data[0] || []).map((seg) => seg[0]).join("");
    // Restore shielded terms (tolerate spaces the MT may insert in sentinels).
    shield.forEach((term, i) => {
      zh = zh.replace(new RegExp(`ZZQ\\s*${i}\\s*ZZ`, "gi"), term);
    });
    const out = zh || text;
    trCache.set(t, out);
    return out;
  } catch {
    return text; // graceful fallback to original
  }
}

async function mapLimit(arr, limit, fn) {
  const out = new Array(arr.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, arr.length) }, async () => {
      while (i < arr.length) {
        const idx = i++;
        out[idx] = await fn(arr[idx], idx);
      }
    })
  );
  return out;
}

async function buildNews() {
  console.log("Fetching news feeds…");
  let all = (await Promise.all(FEEDS.map(fetchFeed))).flat();

  const seen = new Set();
  all = all.filter((it) => {
    const key = it.title.toLowerCase().slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  all.sort((a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0));
  all = all.slice(0, 50);

  console.log(`Translating ${all.length} items to Chinese…`);
  const items = await mapLimit(all, 6, async (it) => {
    const [titleZh, summaryZh] = await Promise.all([translate(it.title), translate(it.summary)]);
    return {
      title: titleZh,
      titleEn: it.title,
      summary: summaryZh,
      link: it.link,
      source: it.source,
      image: it.image || null,
      publishedAt: it.publishedAt,
    };
  });

  const news = { updatedAt: new Date().toISOString(), count: items.length, items };
  await writeFile(join(DATA_DIR, "news.json"), JSON.stringify(news, null, 2));
  console.log(`Wrote ${items.length} news items.\n`);
}

// ============================ MODELS ============================

const AA_URL = "https://artificialanalysis.ai/leaderboards/models";

// Walk brackets from an opening "[" to its match, respecting JSON strings.
function balancedArrayAt(text, openIdx) {
  let depth = 0, inStr = false, esc = false;
  for (let j = openIdx; j < text.length; j++) {
    const c = text[j];
    if (esc) { esc = false; continue; }
    if (c === "\\") { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) return text.slice(openIdx, j + 1); }
  }
  return null;
}

function parseArtificialAnalysis(html) {
  const chunks = [...html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)].map((m) => m[1]);
  const p = chunks.join("").replace(/\\"/g, '"').replace(/\\\\/g, "\\");

  // Find the "models":[ … ] array whose objects carry intelligenceIndex.
  const re = /"models":\[/g;
  let m;
  while ((m = re.exec(p))) {
    const openIdx = p.indexOf("[", m.index);
    const slice = balancedArrayAt(p, openIdx);
    if (slice && slice.includes('"intelligenceIndex"')) {
      try {
        const parsed = JSON.parse(slice);
        if (parsed.some((x) => typeof x.intelligenceIndex === "number")) return parsed;
      } catch {}
    }
  }
  return null;
}

// "GPT-5.5 (xhigh)" -> "GPT-5.5" ; collapse effort/variant suffixes.
const baseName = (n) => n.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();

// Domain boards, each ranked by a real Artificial Analysis metric. The first
// (intelligence) is the overall composite; the rest are per-domain.
const CATEGORIES = [
  { id: "intelligence", name: "综合", icon: "🧠", field: "intelligenceIndex",
    note: "综合各项基准的总能力，越高越强（AA Intelligence Index）" },
  { id: "coding", name: "编程", icon: "💻", field: "codingIndex",
    note: "代码生成与软件工程能力（AA Coding Index）" },
  { id: "agentic", name: "智能体·工具", icon: "🤖", field: "agenticIndex",
    note: "自主调用工具、完成多步骤任务的能力（AA Agentic Index）" },
  { id: "reasoning", name: "科学推理", icon: "🔬", field: "gpqa",
    note: "博士级科学难题推理（GPQA Diamond）" },
  { id: "knowledge", name: "知识问答", icon: "📚", field: "omniscience",
    note: "事实知识的广度与准确度（AA Omniscience）" },
  { id: "instruction", name: "指令遵循", icon: "📐", field: "ifbench",
    note: "严格按复杂要求执行的能力（IFBench）" },
  { id: "longcontext", name: "长文本", icon: "📖", field: "lcr",
    note: "超长上下文的理解与推理（Long Context Reasoning）" },
  { id: "multimodal", name: "多模态·看图", icon: "🖼️", field: "mmmuPro",
    note: "理解图像与图表的多模态能力（MMMU-Pro）" },
];

async function buildModels() {
  console.log("Fetching model leaderboard (Artificial Analysis)…");
  let scored = null;
  try {
    const res = await fetch(AA_URL, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(25000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    scored = parseArtificialAnalysis(await res.text());
  } catch (err) {
    console.warn(`  ✗ ${err.message}`);
  }

  const active = (scored || []).filter(
    (m) => !m.deprecated && typeof m.intelligenceIndex === "number"
  );

  if (active.length < 10) {
    console.warn("  ! Too few models parsed — keeping previous models.json (self-heal).");
    return;
  }

  // Build one ranked board per category.
  const categories = CATEGORIES.map((cat) => {
    // Keep the best-scoring variant per (org, base name) for THIS metric.
    const byKey = new Map();
    for (const m of active) {
      const v = m[cat.field];
      if (typeof v !== "number") continue;
      const key = `${m.modelCreatorName}|${baseName(m.name)}`;
      const prev = byKey.get(key);
      if (!prev || v > prev[cat.field]) byKey.set(key, m);
    }
    const sorted = [...byKey.values()].sort((a, b) => b[cat.field] - a[cat.field]);
    // Some AA metrics are 0–1 accuracies, others 0–100 index points.
    // Normalize fractional metrics to percentages for consistent display.
    const maxRaw = sorted.length ? sorted[0][cat.field] : 0;
    const isPct = maxRaw <= 1.5;
    const factor = isPct ? 100 : 1;
    const models = sorted.slice(0, 25).map((m, i) => ({
      rank: i + 1,
      name: baseName(m.name),
      org: m.modelCreatorName || "—",
      country: m.modelCreatorCountry || null,
      score: Math.round(m[cat.field] * factor * 10) / 10,
      released: m.releaseDate || null,
    }));
    return { ...cat, unit: isPct ? "%" : "分", count: models.length, models };
  }).filter((c) => c.models.length >= 3);

  const out = {
    updatedAt: new Date().toISOString(),
    source: "Artificial Analysis",
    sourceUrl: AA_URL,
    categories,
  };
  await writeFile(join(DATA_DIR, "models.json"), JSON.stringify(out, null, 2));
  const overall = categories[0];
  console.log(
    `Wrote ${categories.length} category boards. ` +
      `综合 top: ${overall.models[0].name} ${overall.models[0].score}.\n`
  );
}

// ============================ MAIN ============================

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const only = onlyArg ? onlyArg.split("=")[1] : null;
  if (!only || only === "news") await buildNews();
  if (!only || only === "models") await buildModels();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
