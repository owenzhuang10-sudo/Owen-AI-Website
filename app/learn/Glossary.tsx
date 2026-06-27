"use client";

import { useMemo, useState } from "react";
import { GLOSSARY_TERMS } from "@/lib/glossary";

export default function Glossary() {
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<"all" | "beginner" | "advanced">("all");

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return GLOSSARY_TERMS.filter((t) => {
      if (level !== "all" && t.level !== level) return false;
      if (!kw) return true;
      return (
        t.term.toLowerCase().includes(kw) ||
        t.en.toLowerCase().includes(kw) ||
        t.def.toLowerCase().includes(kw)
      );
    });
  }, [q, level]);

  return (
    <section id="glossary" className="track">
      <div className="track-head" style={{ background: "var(--bg-soft)" }}>
        <span className="track-icon">📖</span>
        <div>
          <h2>术语小词典</h2>
          <p>看到不懂的 AI 名词？在这里快速查。共 {GLOSSARY_TERMS.length} 条。</p>
        </div>
      </div>

      <div className="glossary-controls">
        <input
          className="glossary-search"
          type="text"
          placeholder="搜索术语，如 token、RAG、幻觉…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="glossary-filters">
          {([
            ["all", "全部"],
            ["beginner", "入门"],
            ["advanced", "进阶"],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              className={`glossary-filter ${level === val ? "active" : ""}`}
              onClick={() => setLevel(val)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="note">没有匹配「{q}」的术语，换个关键词试试。</p>
      ) : (
        <div className="glossary-grid">
          {filtered.map((t) => (
            <div key={t.en} className="glossary-card">
              <div className="glossary-term">
                {t.term}
                <span className="glossary-en">{t.en}</span>
                <span className={`glossary-badge ${t.level}`}>
                  {t.level === "beginner" ? "入门" : "进阶"}
                </span>
              </div>
              <p className="glossary-def">{t.def}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
