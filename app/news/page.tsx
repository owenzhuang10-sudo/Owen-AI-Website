import { getNews } from "@/lib/data";
import { formatUpdated } from "@/lib/format";
import NewsCard from "../NewsCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI 新闻动态 · 跟着 Owen 学 AI",
  description: "实时追踪全球 AI 行业新闻，自动翻译成中文，每日更新。",
};

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <section className="hero">
        <h1>AI 新闻动态</h1>
        <p>实时追踪全球 AI 行业大事，自动翻译成中文，每日更新。</p>
        <span className="updated">
          <span className="dot" />
          更新于 {formatUpdated(news.updatedAt)} · {news.count} 条
        </span>
      </section>

      <div className="news-list">
        {news.items.length === 0 && (
          <p className="note">暂无新闻数据，请先运行 `npm run fetch`。</p>
        )}
        {news.items.map((it, i) => (
          <NewsCard key={i} it={it} />
        ))}
      </div>
    </>
  );
}
