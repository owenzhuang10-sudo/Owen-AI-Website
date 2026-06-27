export function flag(country: string | null): string {
  const map: Record<string, string> = {
    us: "🇺🇸", cn: "🇨🇳", fr: "🇫🇷", gb: "🇬🇧", ca: "🇨🇦",
    de: "🇩🇪", il: "🇮🇱", jp: "🇯🇵", kr: "🇰🇷",
  };
  return (country && map[country.toLowerCase()]) || "🌐";
}

export function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const then = Date.parse(iso);
  if (isNaN(then)) return "";
  const sec = Math.floor((Date.now() - then) / 1000);
  if (sec < 60) return "刚刚";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  return new Date(then).toLocaleDateString("zh-CN");
}

export function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("zh-CN", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
