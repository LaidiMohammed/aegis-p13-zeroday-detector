import { NextRequest, NextResponse } from "next/server";
import { analyzeText } from "@/lib/detector";

export const runtime = "nodejs";

/** POST /api/detect — exécute le détecteur CWE-22 sur le log fourni. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const log = typeof body.log === "string" ? body.log : "";
    if (!log.trim()) {
      return NextResponse.json({ error: "Aucun log fourni" }, { status: 400 });
    }
    const report = analyzeText(log);
    return NextResponse.json({
      ...report,
      detector: "aegis-p13-zeroday-detector (backend TypeScript)",
      engine: "port de src/detect.py — stdlib, 0 GPU, 0 réseau",
    });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
