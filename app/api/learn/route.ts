import { NextResponse } from "next/server";
import { TRACKS, RESOURCES } from "@/lib/learn";
import { GLOSSARY_TERMS } from "@/lib/glossary";
import { AGENT_GUIDES, AGENT_MENTIONS } from "@/lib/agents";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function GET() {
  return NextResponse.json(
    {
      tracks: TRACKS,
      resources: RESOURCES,
      glossary: GLOSSARY_TERMS,
      agents: AGENT_GUIDES,
      agentMentions: AGENT_MENTIONS,
    },
    { headers: CORS }
  );
}

export function OPTIONS() {
  return new Response(null, { headers: CORS });
}
