"use client";

import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/news", label: "新闻动态" },
  { href: "/rankings", label: "大模型排行" },
  { href: "/learn", label: "AI 学习" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="nav">
      {NAV.map((n) => {
        const active =
          n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
        return (
          <a
            key={n.href}
            href={n.href}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {n.label}
          </a>
        );
      })}
    </nav>
  );
}
