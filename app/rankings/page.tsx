import { getModels } from "@/lib/data";
import { formatUpdated } from "@/lib/format";
import RankingBoard from "./RankingBoard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "大模型排行榜 · 跟着 Owen 学 AI",
  description: "综合排名 + 编程、智能体、推理、知识、长文本、多模态等分领域排名，每日更新。",
};

export default async function RankingsPage() {
  const data = await getModels();

  return (
    <>
      <section className="hero">
        <h1>大模型排行榜</h1>
        <p>
          除了综合排名，还按编程、智能体、科学推理、知识、长文本、多模态等
          细分领域分别排名——不同任务，谁更强一目了然。
        </p>
        <span className="updated">
          <span className="dot" />
          更新于 {formatUpdated(data.updatedAt)} · {data.categories.length} 个领域榜单
        </span>
      </section>

      <RankingBoard categories={data.categories} />

      <p className="note">
        数据来源：
        {data.sourceUrl ? (
          <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
            {data.source}
          </a>
        ) : (
          data.source
        )}
        （权威 AI 评测机构）。各领域以对应公开基准评分排名，同系列不同推理档位已合并为最高分代表。
        分数越高越强；带 % 为该基准的准确率，带「分」为综合指数。
      </p>
    </>
  );
}
