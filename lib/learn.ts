export type Lesson = {
  title: string;
  summary: string;
  points: string[];
  link?: { label: string; url: string };
};

export type Track = {
  id: string;
  level: "beginner" | "advanced";
  title: string;
  tagline: string;
  icon: string;
  lessons: Lesson[];
};

export type Resource = {
  title: string;
  desc: string;
  lang: "中" | "EN";
  url: string;
};

// Curated external resources — click through for deeper / official material.
export const RESOURCES: Resource[] = [
  { title: "3Blue1Brown：神经网络系列", desc: "用绝美动画讲清大模型底层，零基础也能看懂", lang: "EN", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" },
  { title: "Anthropic 提示词工程指南", desc: "官方出品，把提示词写好的系统方法", lang: "EN", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
  { title: "OpenAI 帮助中心", desc: "ChatGPT 各功能的官方使用说明", lang: "EN", url: "https://help.openai.com/" },
  { title: "图解 Transformer", desc: "想深入原理时，最经典的可视化讲解", lang: "EN", url: "https://jalammar.github.io/illustrated-transformer/" },
  { title: "Hugging Face 学习课程", desc: "免费的 LLM / NLP 系统课程，含动手实践", lang: "EN", url: "https://huggingface.co/learn" },
  { title: "There's An AI For That", desc: "按用途检索 AI 工具的大全导航站", lang: "EN", url: "https://theresanaiforthat.com/" },
  { title: "Google AI 官方博客", desc: "追前沿研究和产品动态的一手来源", lang: "EN", url: "https://blog.google/technology/ai/" },
  { title: "Artificial Analysis", desc: "本站排行榜数据源，模型能力 / 价格深度对比", lang: "EN", url: "https://artificialanalysis.ai/" },
];

export const TRACKS: Track[] = [
  {
    id: "beginner",
    level: "beginner",
    title: "新手入门",
    tagline: "零基础也能看懂：先理解 AI 大模型是什么，再学会上手用起来。",
    icon: "🌱",
    lessons: [
      {
        title: "什么是 AI 大模型（LLM）？",
        summary:
          "可以把大模型想象成一个读过海量文字、极其擅长「猜下一个词」的超级大脑。你说上半句，它根据学过的规律续写下半句。",
        points: [
          "本质：根据上文预测下一个最可能的字/词，连起来就成了流畅的回答",
          "「大」指参数量巨大（数十亿到上万亿），见过的文本越多越聪明",
          "它不是数据库，不会「查」答案，而是「生成」答案",
        ],
        link: {
          label: "3Blue1Brown：大模型是怎么工作的（中字）",
          url: "https://www.youtube.com/watch?v=wjZofJX0v4M",
        },
      },
      {
        title: "它是怎么「学会」的？",
        summary:
          "模型先在海量互联网文本上「预训练」打基础，再通过人类反馈「对齐」，学会礼貌、有用、安全地回答。",
        points: [
          "预训练：阅读海量文本，学习语言规律与世界知识",
          "微调 / RLHF：人类示范和打分，教它怎样回答更有用、更安全",
          "训练有「知识截止日期」，之后发生的事它不一定知道",
        ],
        link: {
          label: "OpenAI：大模型是如何训练出来的",
          url: "https://platform.openai.com/docs/guides/what-are-models",
        },
      },
      {
        title: "Token 与上下文窗口",
        summary:
          "模型不是按「字」而是按「token（词元）」读写。一次能记住的 token 数量叫「上下文窗口」，决定了它能处理多长的内容。",
        points: [
          "1 个中文字约等于 1~2 个 token；上下文越长，越能处理长文档",
          "超出窗口的内容会被「遗忘」——长对话里它可能忘了开头",
          "API 通常按 token 计费，输入和输出都算钱",
        ],
        link: {
          label: "在线体验：OpenAI Tokenizer（看文字怎么被切成 token）",
          url: "https://platform.openai.com/tokenizer",
        },
      },
      {
        title: "为什么它会「一本正经地胡说」？",
        summary:
          "这叫「幻觉」。模型追求「读起来合理」，而非「事实正确」，所以可能编造看似可信但错误的内容。",
        points: [
          "重要信息（数字、引用、法律医疗）一定要自己核实",
          "让它「给出处」或「不确定就说不知道」能减少幻觉",
          "把资料贴给它再让它基于资料回答，比让它凭记忆答更可靠",
        ],
        link: {
          label: "维基百科：什么是 AI 幻觉",
          url: "https://zh.wikipedia.org/wiki/幻觉_(人工智能)",
        },
      },
      {
        title: "第一次用 AI 工具",
        summary:
          "挑一个对话工具开始聊就行。国内可用豆包、Kimi、通义千问、文心一言；国际有 ChatGPT、Claude、Gemini。",
        points: [
          "像和人聊天一样提问，不需要任何指令格式",
          "回答不满意就追问、让它改——多轮对话是常态",
          "先用免费版熟悉，需要更强能力再考虑付费",
        ],
      },
      {
        title: "提问的艺术：提示词基础",
        summary:
          "同样的问题，问法不同效果天差地别。给足背景、明确要求，AI 才能给出你真正想要的答案。",
        points: [
          "给背景：你是谁、为什么问、面向什么读者",
          "给角色：「假设你是资深 HR…」能提升专业度",
          "给格式：要表格、要分点、要字数，说清楚就会照做",
          "给例子：示范一两个你想要的样子（few-shot）",
        ],
        link: {
          label: "Anthropic 提示词工程指南",
          url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
        },
      },
      {
        title: "常见 AI 工具地图",
        summary:
          "AI 不只会聊天。按用途选对工具，效率翻倍。",
        points: [
          "写作 / 答疑：ChatGPT、Claude、豆包、Kimi",
          "画图：Midjourney、即梦、Stable Diffusion",
          "写代码：Claude Code、GitHub Copilot、Cursor",
          "搜索 / 调研：Perplexity、各家联网搜索功能",
        ],
        link: {
          label: "AI 工具大全：There's An AI For That（按用途找工具）",
          url: "https://theresanaiforthat.com/",
        },
      },
    ],
  },
  {
    id: "advanced",
    level: "advanced",
    title: "进阶：把大模型用好",
    tagline: "不讲晦涩原理，只讲实战——怎么选模型、怎么省钱、怎么用 AI 大幅提升工作和生活效率，怎么让它越来越懂你。",
    icon: "🚀",
    lessons: [
      {
        title: "选对模型干对活：什么模型擅长什么",
        summary:
          "没有「最好」的模型，只有「最合适」的。把任务交给擅长它的模型，又快又好又省钱。",
        points: [
          "日常问答 / 写作 / 聊天：用通用中档模型就够了",
          "复杂推理 / 数学 / 写代码：上「推理模型」或旗舰（GPT-5.5、Claude Opus、Gemini Pro）",
          "要快、要便宜、量大：用小模型（mini / flash 档）",
          "读长文档 / 整本书：选「大上下文窗口」的模型",
          "画图、语音、视频：用专门工具，别用文字模型硬做",
        ],
        link: { label: "对照本站大模型排行榜按能力挑", url: "/rankings" },
      },
      {
        title: "同一个对话继续，还是新开一个？",
        summary:
          "这是用 AI 最常见的纠结。原则：话题变了就开新的，任务连续就接着聊。",
        points: [
          "换全新话题 → 新开对话：旧内容会干扰它、还白白多花钱",
          "同一件事不断深入 → 继续聊：它记得前因后果，配合更默契",
          "对话太长变慢、变贵、开始「忘事」→ 新开一个，把关键结论复制过去",
          "重要的固定设定（你的身份、偏好）→ 放进「自定义指令 / 记忆」，不用每次重说",
        ],
      },
      {
        title: "怎么用 AI 更省钱",
        summary:
          "同样的活，会用的人花的钱可能是别人的几分之一。核心是「别用大炮打蚊子」。",
        points: [
          "简单任务用便宜的小模型，别动不动就上最贵的旗舰",
          "充分利用各家的免费额度，先白嫖再说",
          "长对话定期重开，避免把一长串历史反复计费",
          "只在真正需要时才开「深度思考 / 推理」模式——它更慢更贵",
          "批量重复任务走 API + 提示缓存，比手点便宜得多",
        ],
        link: {
          label: "OpenRouter：横向对比各模型价格",
          url: "https://openrouter.ai/models",
        },
      },
      {
        title: "用 AI 提升工作效率：高频场景",
        summary:
          "把 AI 当成永远在线的助理，这些活它能帮你省下大把时间。",
        points: [
          "起草邮件、周报、会议纪要，再让它按你的语气润色",
          "整理表格数据、写 Excel 公式、清洗杂乱信息",
          "长文档 / 报告一键总结，提炼要点和待办",
          "写代码、查 bug、解释看不懂的报错",
          "做 PPT 大纲、方案框架、头脑风暴",
        ],
      },
      {
        title: "用 AI 提升生活效率：高频场景",
        summary:
          "不只是工作，生活里很多琐事也能甩给 AI。",
        points: [
          "规划旅行行程、活动安排、预算清单",
          "定制健身计划、食谱、学习计划",
          "翻译、练口语、模拟面试和重要对话",
          "看不懂的合同、说明书、体检报告，让它讲人话",
          "当陪练：辩论、决策利弊分析、情绪疏导",
        ],
      },
      {
        title: "教会 AI 更懂你",
        summary:
          "用得越久越顺手的秘密，是主动「喂」给它关于你的信息，让回答越来越贴合你。",
        points: [
          "用「自定义指令 / 记忆」功能，一次性告诉它你的身份、职业、偏好、说话风格",
          "每次提问给足背景：为谁做、什么场景、想要什么结果",
          "把常用需求整理成「提示词模板」，下次直接套用",
          "把你的资料（简历、产品文档、写作样例）发给它，让它照着你的风格来",
          "回答不对就明确纠正，它会在这次对话里越调越准",
        ],
        link: {
          label: "ChatGPT 自定义指令官方说明",
          url: "https://help.openai.com/en/articles/8096356-custom-instructions-for-chatgpt",
        },
      },
      {
        title: "提示词实战技巧",
        summary:
          "几个立竿见影的小技巧，不用懂原理也能让回答质量翻倍。",
        points: [
          "让它「先复述一遍我的需求，再开始做」，避免跑偏",
          "不满意就说「给我 3 个不同方案」，再挑一个深入",
          "要求它「分步骤说明 + 给出理由」，结果更靠谱",
          "让它扮演挑刺的人：「找出这份方案的 5 个漏洞」",
          "给例子比给描述更有效：示范一个你想要的样子",
        ],
      },
      {
        title: "让 AI 帮你处理资料",
        summary:
          "别再复制粘贴一段段问，直接把资料丢给它，效率高得多。",
        points: [
          "直接上传 PDF、图片、表格，让它读完再回答",
          "贴一大段长文，让它总结、提取要点、做成表格",
          "开「联网搜索」获取最新信息，弥补知识截止日期",
          "强调「只根据我给的资料回答，不确定就说没有」，减少瞎编",
        ],
      },
    ],
  },
];
