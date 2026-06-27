import { getNews, getModels } from "@/lib/data";
import { formatUpdated, flag } from "@/lib/format";
import NewsCard from "./NewsCard";
import { TRACKS } from "@/lib/learn";
import { AGENT_GUIDES } from "@/lib/agents";
import { GLOSSARY_TERMS } from "@/lib/glossary";

// Always read fresh JSON on each request so daily updates show without a rebuild.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [news, models] = await Promise.all([getNews(), getModels()]);
  const overall = models.categories[0];
  const topModels = overall ? overall.models.slice(0, 5) : [];
  const topNews = news.items.slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <span className="hero-kicker">🎓 你的 AI 学习与情报站</span>
          <h1>
            跟着 <span className="grad">Owen</span> 学 AI
          </h1>
          <p>
            一个地方搞定：追最新 AI 动态、看全球大模型排行、从零基础学到玩转智能体。
            内容每天自动更新，新手也能轻松上手。
          </p>
          <div className="hero-cta">
            <a href="/learn" className="btn btn-primary">开始学习 AI →</a>
            <a href="/rankings" className="btn btn-ghost">看大模型排行</a>
          </div>
          <span className="updated">
            <span className="dot" />
            数据更新于 {formatUpdated(news.updatedAt)}
          </span>
        </div>
      </section>

      {/* Rankings preview */}
      <div className="section-head">
        <h2>🏆 大模型排行 · 综合 Top 5</h2>
        <a href="/rankings">编程 / 推理 / 多模态等分领域榜 →</a>
      </div>
      <div className="board">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>模型</th>
              <th className="num">综合得分</th>
            </tr>
          </thead>
          <tbody>
            {topModels.map((m) => (
              <tr key={`${m.org}-${m.name}`}>
                <td className={`rank-cell rank-${m.rank}`}>{m.rank}</td>
                <td>
                  <div className="model-name">
                    {flag(m.country)} {m.name}
                  </div>
                  <div className="model-org">{m.org}</div>
                </td>
                <td className="num">
                  <span className="score">{m.score.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* News preview */}
      <div className="section-head">
        <h2>📰 最新动态</h2>
        <a href="/news">更多新闻 →</a>
      </div>
      <div className="news-list">
        {topNews.length === 0 && (
          <p className="note">暂无新闻数据，请先运行 `npm run fetch`。</p>
        )}
        {topNews.map((it, i) => (
          <NewsCard key={i} it={it} />
        ))}
      </div>

      {/* Learning preview */}
      <div className="section-head">
        <h2>📚 AI 学习</h2>
        <a href="/learn">进入学习中心 →</a>
      </div>
      <div className="learn-preview">
        {TRACKS.map((t) => (
          <a key={t.id} href={`/learn#${t.id}`} className={`preview-card ${t.level}`}>
            <span className="preview-icon">{t.icon}</span>
            <h3>{t.title}</h3>
            <p>{t.tagline}</p>
            <span className="preview-meta">{t.lessons.length} 节课程 →</span>
          </a>
        ))}
        <a href="/learn#agents" className="preview-card advanced">
          <span className="preview-icon">🤖</span>
          <h3>热门智能体上手</h3>
          <p>2026 最火的开源智能体 Hermes、OpenClaw 手把手教程，让 AI 自己干活。</p>
          <span className="preview-meta">{AGENT_GUIDES.length} 个智能体教程 →</span>
        </a>
        <a href="/learn#glossary" className="preview-card">
          <span className="preview-icon">📖</span>
          <h3>术语小词典</h3>
          <p>token、RAG、幻觉、智能体…看到不懂的 AI 名词，一搜就懂。</p>
          <span className="preview-meta">{GLOSSARY_TERMS.length} 条术语 →</span>
        </a>
      </div>
    </>
  );
}
