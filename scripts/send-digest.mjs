#!/usr/bin/env node
/**
 * Sends the daily AI-news digest email to subscribers.
 * Runs in the GitHub Action after fetch-data.mjs writes data/news.json.
 *
 * Required env vars (set as GitHub repo secrets):
 *   SUPABASE_URL            e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY    Supabase service_role key (bypasses RLS)
 *   RESEND_API_KEY          Resend API key
 *   DIGEST_FROM             verified sender, e.g. "跟着 Owen 学 AI <news@yourdomain.com>"
 *   SITE_URL                (optional) link back to the site
 *
 * If any required var is missing, it skips gracefully (workflow stays green).
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  RESEND_API_KEY,
  DIGEST_FROM,
  SITE_URL = "https://owen-ai-website.vercel.app",
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_API_KEY || !DIGEST_FROM) {
  console.log("Digest: missing env vars — skipping (configure secrets to enable).");
  process.exit(0);
}

async function getSubscribers() {
  const url = `${SUPABASE_URL}/rest/v1/subscriptions?daily_news=eq.true&select=email`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return [...new Set(rows.map((r) => r.email).filter(Boolean))];
}

function buildHtml(items) {
  const today = new Date().toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
  });
  const rows = items
    .map(
      (it) => `
      <tr><td style="padding:14px 0;border-bottom:1px solid #eee;">
        <div style="font-size:12px;color:#5b6cff;font-weight:700;">${it.source}</div>
        <a href="${it.link}" style="font-size:16px;font-weight:700;color:#1f2340;text-decoration:none;line-height:1.5;">${it.title}</a>
        ${it.summary ? `<div style="font-size:13px;color:#5a6079;margin-top:5px;line-height:1.6;">${it.summary}</div>` : ""}
      </td></tr>`
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f5f7fe;padding:24px;font-family:-apple-system,Segoe UI,PingFang SC,Roboto,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;">
      <div style="font-size:22px;font-weight:800;color:#1f2340;">🎓 跟着 <span style="color:#5b6cff;">Owen</span> 学 AI</div>
      <div style="font-size:14px;color:#5a6079;margin-top:4px;">${today} · 每日 AI 新闻摘要</div>
      <table style="width:100%;border-collapse:collapse;margin-top:14px;">${rows}</table>
      <div style="margin-top:24px;text-align:center;">
        <a href="${SITE_URL}" style="display:inline-block;background:#5b6cff;color:#fff;padding:12px 24px;border-radius:10px;font-weight:700;text-decoration:none;">查看更多 →</a>
      </div>
      <div style="font-size:11px;color:#969cb6;margin-top:22px;text-align:center;line-height:1.6;">
        你收到此邮件是因为在「跟着 Owen 学 AI」App 中订阅了每日新闻。<br/>在 App 的「我的」页面可随时取消订阅。
      </div>
    </div></body></html>`;
}

async function sendEmail(to, html, subject) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: DIGEST_FROM, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

async function main() {
  const news = JSON.parse(
    await readFile(join(__dirname, "..", "data", "news.json"), "utf8")
  );
  const items = news.items.slice(0, 10);
  if (items.length === 0) return console.log("Digest: no news, skipping.");

  const subscribers = await getSubscribers();
  if (subscribers.length === 0) return console.log("Digest: no subscribers.");

  const html = buildHtml(items);
  const subject = `每日 AI 新闻 · ${items[0].title.slice(0, 24)}…`;

  let ok = 0;
  for (const email of subscribers) {
    try {
      await sendEmail(email, html, subject);
      ok++;
    } catch (err) {
      console.warn(`  ✗ ${email}: ${err.message}`);
    }
  }
  console.log(`Digest: sent to ${ok}/${subscribers.length} subscribers.`);
}

main().catch((err) => {
  console.error("Digest fatal:", err.message);
  process.exit(0); // never fail the workflow over email issues
});
