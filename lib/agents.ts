export type AgentGuide = {
  name: string;
  emoji: string;
  tags: string[];
  whatIs: string;
  bestFor: string;
  steps: string[];
  install?: string;
  docs: { label: string; url: string };
  repo?: { label: string; url: string };
};

export const AGENT_GUIDES: AgentGuide[] = [
  {
    name: "Hermes Agent",
    emoji: "🪽",
    tags: ["开源 · MIT", "会自我学习", "Nous Research"],
    whatIs:
      "由 Nous Research 出品的开源智能体，2026 年爆火。最大特点是「越用越懂你」——它会从每次任务里自动总结出新技能、记住你的工作习惯，跨对话不断完善对你的理解。",
    bestFor:
      "想要一个长期陪伴、会成长的私人 AI 助理；喜欢在终端 / Telegram / 微信类工具里随时使唤它的人。",
    steps: [
      "确保电脑装了基础环境（macOS / Linux / Windows 均可，Windows 建议用 WSL2）",
      "运行下方安装命令，自动装好",
      "输入 `hermes setup` 走配置向导：选模型、填 API Key",
      "输入 `hermes` 直接开聊；用 `hermes gateway` 还能接到 Telegram / Discord / Slack",
      "随便用——它会自己积累技能和对你的记忆，越用越顺手",
    ],
    install: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
    docs: { label: "Hermes 官方文档", url: "https://hermes-agent.nousresearch.com/docs/" },
    repo: { label: "GitHub 仓库", url: "https://github.com/nousresearch/hermes-agent" },
  },
  {
    name: "Claude Code",
    emoji: "🟧",
    tags: ["Anthropic 官方", "编程最强之一", "终端 / IDE"],
    whatIs:
      "Anthropic 官方推出的编程智能体，由 Claude 模型驱动。它能读懂整个代码库、自己写代码、跑命令、改 bug，是目前最受开发者欢迎的 AI 编程工具之一。也能在 VS Code、JetBrains 等 IDE 里用。",
    bestFor:
      "程序员和想用 AI 写代码 / 做小工具 / 自动化的人；从「让它改一个文件」到「让它独立完成一个功能」都能胜任。",
    steps: [
      "装好 Node.js 18+，并准备一个 Anthropic 账号",
      "运行下方命令全局安装 Claude Code",
      "进入你的项目目录，输入 `claude` 启动",
      "首次会引导你登录 / 填 API Key",
      "直接用中文告诉它你想做什么，它会自己读代码、改文件、跑测试",
    ],
    install: "npm install -g @anthropic-ai/claude-code",
    docs: { label: "Claude Code 官方文档", url: "https://docs.claude.com/en/docs/claude-code/overview" },
    repo: { label: "了解 Claude Code", url: "https://claude.com/claude-code" },
  },
  {
    name: "OpenClaw",
    emoji: "🦞",
    tags: ["开源 · MIT", "功能最全", "100+ 技能"],
    whatIs:
      "基于 Node.js 的开源智能体平台，被称为「功能最完整的自托管智能体框架」。内置 100+ 现成技能，有活跃的技能市场 ClawHub，原生支持 Telegram / Discord / WhatsApp。",
    bestFor:
      "想自己搭一个全能 AI 助理、并接入各种工具和消息平台的人；喜欢从技能市场一键扩展能力的折腾党。",
    steps: [
      "装好 Node.js 24（或 22.19+），至少 512MB 内存",
      "运行下方一键安装命令（也可从 GitHub 克隆后 `npm install && npm start`）",
      "运行 `openclaw onboard --install-daemon` 进入向导（约 2 分钟）",
      "在向导里选模型供应商、填 API Key、配置消息网关",
      "去 ClawHub 挑现成技能，给你的智能体一键加能力",
    ],
    install: "curl -fsSL https://openclaw.ai/install.sh | bash",
    docs: { label: "OpenClaw 官方文档", url: "https://docs.openclaw.ai/start/getting-started" },
    repo: { label: "GitHub 仓库", url: "https://github.com/openclaw/openclaw" },
  },
];

// Lighter mentions — well-known agents worth knowing, no full tutorial.
export const AGENT_MENTIONS: { name: string; note: string; url: string }[] = [
  { name: "OpenAI Codex", note: "OpenAI 的代码智能体，与 ChatGPT 生态打通", url: "https://openai.com/codex" },
  { name: "Cursor", note: "最流行的 AI 代码编辑器，写代码体验顺滑", url: "https://cursor.com" },
  { name: "Manus", note: "通用型自主智能体，能独立完成多步骤任务", url: "https://manus.im" },
];
