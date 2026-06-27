# 跟着 Owen 学 AI

实时 AI 新闻动态 + 全球大模型排行榜 + 从入门到进阶的 AI 学习与智能体教程，数据每日自动更新。

## 功能

- **新闻动态**：每日从公开 RSS 源（TechCrunch、MIT Tech Review、Google AI、Ars Technica、The Verge、VentureBeat）实时抓取最新 AI 新闻，自动去重、按时间排序，并**自动翻译成中文**（品牌名/模型名保留原文）。
- **大模型排行**：评分来自权威评测机构 **Artificial Analysis**。除综合排名外，按 **8 个细分领域**分别排名——综合、编程、智能体·工具、科学推理、知识问答、指令遵循、长文本、多模态·看图，每个领域对应一项真实公开基准，可在页面切换。
- **每日更新**：定时任务每天早上 **07:00**（9 点前）运行抓取脚本，页面每次请求读取最新数据，无需重新构建。

## 数据来源（全自动，无需 API Key）

| 数据 | 来源 | 方式 |
|------|------|------|
| 新闻 | 6 个权威英文 AI RSS 源 | 实时抓取 + 自动中译 |
| 排行/评分 | [Artificial Analysis](https://artificialanalysis.ai/leaderboards/models) | 解析页面内嵌结构化数据 |

> 排行榜抓取具备**自愈**能力：若某天抓取或解析失败，会自动保留上一次成功的数据，页面不会空白。

## 本地运行

```bash
npm install
npm run fetch      # 抓取最新数据，生成 data/news.json 和 data/models.json
npm run dev        # 启动开发服务器 http://localhost:3000
```

## 数据更新

```bash
npm run fetch          # 抓新闻 + 重建榜单
npm run fetch:news     # 只更新新闻
npm run fetch:models   # 只更新榜单
```

- 新闻源在 `scripts/fetch-data.mjs` 的 `FEEDS` 数组中，可自行增删。
- 中译保护的品牌/模型名在同文件的 `GLOSSARY` 数组中。

## 每天自动更新（本地 cron）

```bash
bash scripts/install-cron.sh    # 安装：每天 07:00 自动抓取（9 点前完成）
crontab -l                      # 查看
```

## 部署（推荐 Vercel）

```bash
npm run build && npm run start
```

部署到 Vercel 后，用 Vercel Cron 每天触发抓取（见 `vercel.json`）。
