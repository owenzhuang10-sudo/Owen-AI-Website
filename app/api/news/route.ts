import { NextResponse } from "next/server";
import { getNews } from "@/lib/data";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function GET() {
  const news = await getNews();
  return NextResponse.json(news, { headers: CORS });
}

export function OPTIONS() {
  return new Response(null, { headers: CORS });
}
