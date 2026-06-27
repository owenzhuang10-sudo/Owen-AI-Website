import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");

export type NewsItem = {
  title: string;
  titleEn?: string;
  link: string;
  source: string;
  summary: string;
  image?: string | null;
  publishedAt: string | null;
};

export type NewsData = {
  updatedAt: string;
  count: number;
  items: NewsItem[];
};

export type Model = {
  rank: number;
  name: string;
  org: string;
  country: string | null;
  score: number;
  released: string | null;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  note: string;
  unit: string;
  count: number;
  models: Model[];
};

export type ModelsData = {
  updatedAt: string;
  source: string;
  sourceUrl?: string;
  categories: Category[];
};

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getNews() {
  return readJson<NewsData>("news.json", {
    updatedAt: new Date().toISOString(),
    count: 0,
    items: [],
  });
}

export function getModels() {
  return readJson<ModelsData>("models.json", {
    updatedAt: new Date().toISOString(),
    source: "—",
    categories: [],
  });
}
