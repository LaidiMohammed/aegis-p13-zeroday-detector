"use client";

import { useState, type ReactNode } from "react";

/* Extraits réels de src/detect.py — voir le dépôt pour le fichier complet. */
const FILES = [
  {
    name: "detect.py · classify_path",
    code: `def classify_path(path: str) -> dict[str, Any]:
    """Classifie un chemin : traversal + chemin sensible → critique."""
    decoded = _decode_path(path)
    traversal = any(
        re.search(p, path, re.I) or re.search(p, decoded, re.I)
        for p in TRAVERSAL_PATTERNS
    )
    sensitive = any(
        re.search(p, decoded, re.I) for p in SENSITIVE_PATH_PATTERNS
    )
    if traversal and sensitive:
        risk, cwe = "critical", "CWE-22 (Path Traversal) + fuite système"
    elif traversal:
        risk, cwe = "high", "CWE-22 (Path Traversal)"
    elif sensitive:
        risk, cwe = "medium", "CWE-200 (Information Exposure)"
    else:
        risk, cwe = "low", "-"
    return {"path": path, "risk": risk, "cwe": cwe, "decoded": decoded}`,
  },
  {
    name: "detect.py · _decode_path",
    code: `def _decode_path(path: str) -> str:
    """Décode doublement ou simplement les encodages courants."""
    out = path
    for _ in range(3):
        nxt = (
            out.replace("%2e", ".").replace("%2E", ".")
               .replace("%2f", "/").replace("%2F", "/")
               .replace("%5c", "\\\\")
        )
        if nxt == out:
            break
        out = nxt
    return out`,
  },
  {
    name: "detect.py · analyze_line",
    code: `def analyze_line(line: str, idx: int = 0) -> list[dict[str, Any]]:
    """Analyse une ligne de log, retourne une liste d'alertes."""
    alerts: list[dict[str, Any]] = []
    for p in extract_paths(line):
        info = classify_path(p)
        if info["risk"] in ("high", "critical"):
            ts = _TIME_RE.search(line)
            alerts.append({
                "timestamp": ts.group(1).replace(" ", "T")
                             if ts else datetime.now(timezone.utc)
                                          .isoformat(timespec="seconds"),
                "line_no": idx,
                "path": info["path"],
                "risk": info["risk"],
                "reason": info["reason"],
                "cwe": info["cwe"],
                "evidence": line.strip()[:400],
            })
    return alerts`,
  },
];

const KEYWORDS = new Set([
  "def", "return", "for", "if", "elif", "else", "in", "import", "from",
  "and", "or", "not", "any", "while", "as", "class", "str", "int", "list", "dict",
]);

function colorize(line: string): ReactNode {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("#") || trimmed.startsWith('"""') || trimmed.startsWith("///")) {
    return <span className="text-slate-600">{line}</span>;
  }
  const parts = line.split(/("[^"]*"|'[^']*'|\b\w+\b|\s+|[^\w\s])/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (/^["']/.test(p)) return <span key={i} className="text-amber">{p}</span>;
        if (KEYWORDS.has(p)) return <span key={i} className="text-signal">{p}</span>;
        if (/^\d/.test(p)) return <span key={i} className="text-cyan">{p}</span>;
        return <span key={i} className="text-slate-300">{p}</span>;
      })}
    </>
  );
}

export default function CodeSection() {
  const [active, setActive] = useState(0);
  const file = FILES[active];

  return (
    <div className="bracket cut-card overflow-hidden">
      {/* tab bar */}
      <div className="flex flex-wrap gap-px border-b border-slate-700/50 bg-black/30">
        {FILES.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 font-mono text-[11px] transition ${
              i === active
                ? "bg-signal/15 text-signal shadow-[inset_0_-2px_0_0_#ff4d3d]"
                : "text-slate-500 hover:text-slate-200"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>
      {/* code */}
      <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.7] sm:text-[13px]">
        <code>
          {file.code.split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-5 w-6 shrink-0 select-none text-right text-slate-700">{i + 1}</span>
              <span className="whitespace-pre">{colorize(line)}</span>
            </div>
          ))}
        </code>
      </pre>
      <div className="border-t border-slate-700/50 px-5 py-2.5 font-mono text-[11px] text-slate-600">
        stdlib uniquement · typés · testés (pytest) · voir src/detect.py dans le dépôt
      </div>
    </div>
  );
}
