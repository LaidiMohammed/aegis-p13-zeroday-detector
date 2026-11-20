"use client";

import { useState } from "react";

type Phase = "idle" | "scanning" | "done";

/* Données réelles extraites de outputs/detect.json — pas d'invention. */
const LOG_LINES = [
  { line: 4, path: "/ftp/../../../../etc/passwd", code: "403", hit: true },
  { line: 6, path: "/ftp/..%2f..%2fetc%2fshadow", code: "403", hit: true },
  { line: 8, path: "/ftp/../../../etc/shadow", code: "403", hit: true },
];

const ALERTS = [
  { line: 4, path: "/ftp/../../../../etc/passwd", cwe: "CWE-22 + fuite système", risk: "critical" },
  { line: 6, path: "/ftp/..%2f..%2fetc%2fshadow", cwe: "CWE-22 + fuite système", risk: "critical" },
  { line: 8, path: "/ftp/../../../etc/shadow", cwe: "CWE-22 + fuite système", risk: "critical" },
];

export default function DetectionTerminal() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);

  function run() {
    setPhase("scanning");
    setShown(0);
    LOG_LINES.forEach((_, i) => {
      window.setTimeout(() => setShown(i + 1), 320 * (i + 1));
    });
    window.setTimeout(() => setPhase("done"), 320 * LOG_LINES.length + 350);
  }

  function reset() {
    setPhase("idle");
    setShown(0);
  }

  return (
    <div className="bracket cut-card scanlines overflow-hidden">
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-signal" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-cyan" />
          <span className="ml-3 font-mono text-xs text-mist">src.detect — zero_day_detector</span>
        </div>
        <span className="tag text-slate-500">sample_access.log</span>
      </div>

      {/* terminal body */}
      <div className="relative min-h-[320px] p-5 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        <div className="sweep" />
        <div className="text-slate-500">$ python -m src.detect --log src/data/sample_access.log</div>
        <div className="mt-1 text-cyan">[+] chargement : SENSITIVE_PATH_PATTERNS + TRAVERSAL_PATTERNS</div>

        <div className="mt-3 space-y-1">
          {LOG_LINES.slice(0, shown).map((line, i) => (
            <div key={i} className="flex flex-wrap gap-x-2 text-slate-400">
              <span className="text-slate-600">L{line.line}</span>
              <span className="text-amber">{line.path}</span>
              <span className="text-signal">→ {line.code}</span>
              <span className="text-slate-500">traversal détecté; chemin système sensible</span>
            </div>
          ))}
        </div>

        {phase === "idle" && (
          <div className="mt-4 text-slate-500">
            En attente d&apos;exécution<span className="cursor" />
          </div>
        )}

        {phase === "scanning" && shown < LOG_LINES.length && (
          <div className="mt-4 text-amber">
            analyse en cours<span className="cursor" />
          </div>
        )}

        {phase === "done" && (
          <div className="mt-4">
            <div className="rule mb-3" />
            <div className="mb-2 text-slate-300">
              [SUMMARY] total=3 critical=3 high=0 medium=0
            </div>
            <div className="space-y-1.5">
              {ALERTS.map((a) => (
                <div
                  key={a.line}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-signal bg-signal/5 px-3 py-1.5"
                >
                  <span className="text-signal">{a.risk.toUpperCase()}</span>
                  <span className="text-cyan">L{a.line}</span>
                  <span className="text-slate-200">{a.path}</span>
                  <span className="text-amber">{a.cwe}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              exit code 0 · outputs/detect.json · python -m src.detect --text &quot;&lt;ligne&gt;&quot; disponible
            </div>
          </div>
        )}
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-700/50 px-5 py-3">
        {phase !== "done" ? (
          <button
            onClick={run}
            disabled={phase === "scanning"}
            className="bg-signal px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-ink disabled:opacity-50"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
          >
            {phase === "scanning" ? "Analyse..." : "▶ Lancer la détection"}
          </button>
        ) : (
          <button
            onClick={reset}
            className="border border-cyan/50 px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-cyan transition hover:bg-cyan hover:text-ink"
          >
            ↺ Réinitialiser
          </button>
        )}
        <span className="tag text-slate-600">sortie réelle du détecteur · 403 = serve-index bloque le traversal</span>
      </div>
    </div>
  );
}
