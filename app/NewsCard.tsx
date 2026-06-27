import NewsImage from "./NewsImage";
import { timeAgo } from "@/lib/format";
import type { NewsItem } from "@/lib/data";

export default function NewsCard({ it }: { it: NewsItem }) {
  return (
    <a
      className={`news-card ${it.image ? "has-thumb" : ""}`}
      href={it.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <NewsImage src={it.image} alt={it.title} />
      <div className="news-card-body">
        <div className="news-meta">
          <span className="source-tag">{it.source}</span>
          {it.publishedAt && <span>· {timeAgo(it.publishedAt)}</span>}
        </div>
        <h3>{it.title}</h3>
        {it.summary && <p>{it.summary}</p>}
        <span className="news-more">阅读原文 →</span>
      </div>
    </a>
  );
}
