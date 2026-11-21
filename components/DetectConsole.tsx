"use client";

import { useState } from "react";

interface Alert {
  line_no: number;
  path: string;
  decoded: string;
  risk: string;
  reason: string;
  cwe: string;
}
interface Report {
  alerts: Alert[];
  summary: { total_alerts: number; critical: number; high: number; medium: number; low: number };
  detector?: string;
  engine?: string;
  error?: string;
}

const SAMPLE_LOG = `[2026-11-20 09:13:02] GET /ftp/../../../../etc/passwd HTTP/1.1 403 0
[2026-11-20 09:13:10] GET /ftp/..%2f..%2fetc%2fshadow HTTP/1.1 403 0
[2026-11-20 09:14:05] GET /ftp/../../../etc/shadow HTTP/1.1 403 0`;

export default function DetectConsole() {
  const [log, setLog] = useState(SAMPLE_LOG);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  async function launch() {
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log }),
      });
      setReport(await res.json());
    } catch {
      setReport({ alerts: [], summary: { total_alerts: 0, critical: 0, high: 0, medium: 0, low: 0 }, error: "API indisponible" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bracket cut-card scanlines overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-signal" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyan" />
          <span className="ml-3 font-mono text-xs text-mist">POST /api/detect — backend réel</span>
        </div>
        <span className="tag text-slate-500">CWE-22 engine</span>
      </div>

      <div className="p-5">
        <label className="tag mb-2 block text-cyan">Log à analyser</label>
        <textarea
          value={log}
          onChange={(e) => setLog(e.target.value)}
          rows={5}
          className="w-full resize-y border border-slate-700 bg-black/40 p-3 font-mono text-[12px] leading-relaxed text-slate-200 outline-none focus:border-cyan"
          placeholder="Collez une ou plusieurs lignes de log HTTP…"
        />

        <button
          onClick={launch}
          disabled={loading || !log.trim()}
          className="mt-4 w-full bg-signal px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-ink disabled:opacity-50"
          style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
        >
          {loading ? "Analyse serveur en cours…" : "▶ Lancer la détection"}
        </button>

        {report && (
          <div className="mt-5 border-t border-slate-700/50 pt-4">
            {report.error ? (
              <div className="text-signal">[ERREUR] {report.error}</div>
            ) : (
              <>
                <div className="mb-3 font-mono text-sm text-slate-300">
                  [SUMMARY] total={report.summary.total_alerts} critical={report.summary.critical} high={report.summary.high}
                </div>
                <div className="space-y-1.5">
                  {report.alerts.map((a, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-signal bg-signal/5 px-3 py-1.5 font-mono text-[11px]">
                      <span className="text-signal">{a.risk.toUpperCase()}</span>
                      <span className="text-cyan">L{a.line_no}</span>
                      <span className="text-slate-200">{a.path}</span>
                      <span className="text-amber">{a.cwe}</span>
                    </div>
                  ))}
                  {report.alerts.length === 0 && (
                    <div className="text-slate-500">Aucune alerte — le log ne contient pas de traversal détectable.</div>
                  )}
                </div>
                <div className="mt-3 font-mono text-[10px] text-slate-600">{report.detector} · {report.engine}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
