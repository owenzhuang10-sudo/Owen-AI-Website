import { TRACKS, RESOURCES } from "@/lib/learn";
import { AGENT_GUIDES, AGENT_MENTIONS } from "@/lib/agents";
import Glossary from "./Glossary";

export const metadata = {
  title: "AI 学习 · AI 前线",
  description: "从新手到进阶，理解大模型原理，学会使用 AI 工具",
};

export default function LearnPage() {
  return (
    <>
      <section className="hero">
        <h1>AI 学习</h1>
        <p>
          从零基础到进阶，一条清晰的学习路径：先理解 AI 大模型的基本原理，再学会把 AI 工具用进工作与生活。
        </p>
      </section>

      {/* track switcher */}
      <div className="track-nav">
        {TRACKS.map((t) => (
          <a key={t.id} href={`#${t.id}`} className={`track-pill ${t.level}`}>
            <span>{t.icon}</span> {t.title}
            <span className="track-count">{t.lessons.length} 课</span>
          </a>
        ))}
        <a href="#agents" className="track-pill advanced">
          <span>🤖</span> 热门智能体
        </a>
        <a href="#glossary" className="track-pill">
          <span>📖</span> 术语词典
        </a>
        <a href="#resources" className="track-pill">
          <span>🔗</span> 精选资源
        </a>
      </div>

      {TRACKS.map((track) => (
        <section key={track.id} id={track.id} className="track">
          <div className={`track-head ${track.level}`}>
            <span className="track-icon">{track.icon}</span>
            <div>
              <h2>{track.title}</h2>
              <p>{track.tagline}</p>
            </div>
          </div>

          <div className="lessons">
            {track.lessons.map((lesson, i) => (
              <article key={i} className="lesson-card">
                <div className="lesson-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="lesson-body">
                  <h3>{lesson.title}</h3>
                  <p className="lesson-summary">{lesson.summary}</p>
                  <ul className="lesson-points">
                    {lesson.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                  {lesson.link && (
                    <a
                      className="lesson-link"
                      href={lesson.link.url}
                      target={lesson.link.url.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                    >
                      延伸阅读：{lesson.link.label} →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Popular agents */}
      <section id="agents" className="track">
        <div className="track-head advanced">
          <span className="track-icon">🤖</span>
          <div>
            <h2>热门智能体上手教程</h2>
            <p>
              智能体 = 大模型 + 工具 + 自主循环，能自己分步骤把活干完。下面是 2026 年最火的两个开源智能体，手把手教你跑起来。
            </p>
          </div>
        </div>

        <div className="agent-grid">
          {AGENT_GUIDES.map((a) => (
            <article key={a.name} className="agent-card">
              <div className="agent-title">
                <span className="agent-emoji">{a.emoji}</span>
                <h3>{a.name}</h3>
              </div>
              <div className="agent-tags">
                {a.tags.map((t) => (
                  <span key={t} className="agent-tag">{t}</span>
                ))}
              </div>
              <p className="agent-what">{a.whatIs}</p>
              <p className="agent-best">
                <strong>适合谁：</strong>
                {a.bestFor}
              </p>
              <div className="agent-steps-label">上手步骤</div>
              <ol className="agent-steps">
                {a.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              {a.install && (
                <pre className="agent-code">
                  <code>{a.install}</code>
                </pre>
              )}
              <div className="agent-links">
                <a href={a.docs.url} target="_blank" rel="noopener noreferrer">
                  {a.docs.label} →
                </a>
                {a.repo && (
                  <a href={a.repo.url} target="_blank" rel="noopener noreferrer">
                    {a.repo.label} →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="agent-mentions">
          <span className="agent-mentions-label">也值得关注：</span>
          {AGENT_MENTIONS.map((m, i) => (
            <span key={m.name}>
              <a href={m.url} target="_blank" rel="noopener noreferrer">
                {m.name}
              </a>
              <span className="agent-mention-note"> · {m.note}</span>
              {i < AGENT_MENTIONS.length - 1 && <span className="agent-sep">　</span>}
            </span>
          ))}
        </div>
        <p className="note">
          提示：智能体大多需要填模型 API Key（相当于让它「借用」某个大模型的能力），按各自文档操作即可。新手也可以先从「会用对话」起步，熟悉后再玩智能体。
        </p>
      </section>

      <Glossary />

      {/* Curated resources */}
      <section id="resources" className="track">
        <div className="track-head" style={{ background: "var(--bg-soft)" }}>
          <span className="track-icon">🔗</span>
          <div>
            <h2>精选学习资源</h2>
            <p>想深入了解？这些权威网站点进去就能看更多（中英文皆有）。</p>
          </div>
        </div>
        <div className="resource-grid">
          {RESOURCES.map((r) => (
            <a
              key={r.url}
              className="resource-card"
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={`resource-lang ${r.lang === "中" ? "cn" : ""}`}>{r.lang}</span>
              <div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
              <span className="resource-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <p className="note">
        内容持续更新。看完想动手？去 <a href="/rankings" style={{ color: "var(--accent)" }}>大模型排行榜</a> 挑一个模型，回 <a href="/" style={{ color: "var(--accent)" }}>首页</a> 追最新动态。
      </p>
    </>
  );
}
