import type { Metadata } from "next";
import "./globals.css";
import Nav from "./Nav";

export const metadata: Metadata = {
  title: "跟着 Owen 学 AI",
  description:
    "跟着 Owen 学 AI：实时 AI 新闻动态、全球大模型排行榜、从入门到进阶的 AI 学习与智能体教程，每日更新。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <Nav />
            <a href="/" className="logo">
              <span className="logo-mark">🎓</span>
              <span className="logo-text">
                跟着 <span className="logo-owen">Owen</span> 学 AI
              </span>
            </a>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">
            跟着 Owen 学 AI · 数据每日自动更新 · 新闻来自公开源并自动翻译 · 排行榜数据来自 Artificial Analysis
          </div>
        </footer>
      </body>
    </html>
  );
}
