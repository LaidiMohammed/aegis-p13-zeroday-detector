"use client";

import { useState } from "react";

type Phase = "idle" | "scanning" | "done";

const LOG_LINES = [
  { t: "GET /ftp/../../../etc/passwd", code: "200", hit: true },
  { t: "GET /ftp/..%2f..%2f..%2fetc/shadow", code: "200", hit: true },
  { t: "GET /ftp/%2e%2e%2f%2e%2e%2fwindows/win.ini", code: "200", hit: true },
  { t: "GET /ftp/../server.js", code: "403", hit: false },
  { t: "GET /#/ftp/..%252f..%252fetc/passwd", code: "200", hit: true },
];

const ALERTS = [
  { id: "TRAV-001", pattern: "canonical traversal", path: "/etc/passwd", sev: "CRITICAL" },
  { id: "TRAV-002", pattern: "url-encoded traversal", path: "/etc/shadow", sev: "CRITICAL" },
  { id: "TRAV-003", pattern: "double-encoded traversal", path: "/windows/win.ini", sev: "CRITICAL" },
];

export default function DetectionTerminal() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [shown, setShown] = useState(0);

  function run() {
    setPhase("scanning");
    setShown(0);
    LOG_LINES.forEach((_, i) => {
      window.setTimeout(() => setShown(i + 1), 260 * (i + 1));
    });
    window.setTimeout(() => setPhase("done"), 260 * LOG_LINES.length + 350);
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
          <span className="ml-3 font-mono text-xs text-mist">zero_day_detector — live scan</span>
        </div>
        <span className="tag text-slate-500">127.0.0.1:3000</span>
      </div>

      {/* terminal body */}
      <div className="relative min-h-[320px] p-5 font-mono text-[12.5px] leading-relaxed sm:text-sm">
        <div className="sweep" />
        <div className="text-slate-500">$ python -m src.detect --log sample_access.log</div>
        <div className="mt-1 text-cyan">[+] chargement du détecteur CWE-22 ...</div>
        <div className="text-cyan">[+] patterns: canonical + encodés + double-encodés</div>

        <div className="mt-3 space-y-1">
          {LOG_LINES.slice(0, shown).map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-600">{String(i + 1).padStart(2, "0")}</span>
              <span className={line.hit ? "text-amber" : "text-slate-500"}>{line.t}</span>
              <span className={line.hit ? "text-signal" : "text-slate-600"}>→ {line.code}</span>
              {line.hit && <span className="text-signal">ALERT</span>}
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
              [✓] scan terminé — <span className="text-signal font-bold">3 alertes CRITICAL</span>
            </div>
            <div className="space-y-1.5">
              {ALERTS.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-l-2 border-signal bg-signal/5 px-3 py-1.5"
                >
                  <span className="text-signal">{a.sev}</span>
                  <span className="text-slate-400">{a.id}</span>
                  <span className="text-slate-200">{a.pattern}</span>
                  <span className="text-amber">{a.path}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              outputs/detect.json · exit code 0 · 60 lignes · stdlib uniquement
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
            className="group relative bg-signal px-5 py-2 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-ink disabled:opacity-50"
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
        <span className="tag text-slate-600">démonstration · données synthétiques</span>
      </div>
    </div>
  );
}
