"use client";

import { useState } from "react";
import { flag } from "@/lib/format";
import type { Category } from "@/lib/data";

export default function RankingBoard({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(0);
  const cat = categories[active];
  if (!cat) return <p className="note">暂无榜单数据，请先运行 `npm run fetch`。</p>;

  const max = Math.max(...cat.models.map((m) => m.score), 1);
  const min = Math.min(...cat.models.map((m) => m.score), 0);
  const span = Math.max(max - min, 1);

  return (
    <>
      <div className="cat-tabs">
        {categories.map((c, i) => (
          <button
            key={c.id}
            className={`cat-tab ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
      </div>

      <p className="cat-note">{cat.note}</p>

      <div className="board">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>模型</th>
              <th className="num">{cat.name}得分</th>
              <th className="hide-sm">发布</th>
            </tr>
          </thead>
          <tbody>
            {cat.models.map((m) => {
              const barW = 24 + ((m.score - min) / span) * 64;
              return (
                <tr key={`${m.org}-${m.name}`}>
                  <td className={`rank-cell rank-${m.rank}`}>{m.rank}</td>
                  <td>
                    <div className="model-name">
                      {flag(m.country)} {m.name}
                    </div>
                    <div className="model-org">{m.org}</div>
                  </td>
                  <td className="num">
                    <span className="score">
                      {m.score.toFixed(1)}
                      <span className="score-unit">{cat.unit}</span>
                    </span>
                    <span className="score-bar" style={{ width: `${barW}px` }} />
                  </td>
                  <td className="hide-sm model-org">{m.released || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
