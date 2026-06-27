import { NextResponse } from "next/server";
import { getModels } from "@/lib/data";

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function GET() {
  const models = await getModels();
  return NextResponse.json(models, { headers: CORS });
}

export function OPTIONS() {
  return new Response(null, { headers: CORS });
}
