/**
 * lib/detector.ts — Moteur de détection CWE-22 (port TypeScript de src/detect.py).
 * Ce code s'exécute CÔTÉ SERVEUR dans l'API route /api/detect.
 * Aucune dépendance externe — stdlib uniquement, comme le Python d'origine.
 */

export const TRAVERSAL_PATTERNS: RegExp[] = [
  /\.\.\//,
  /\.\.\\/,
  /%2e%2e/i,
  /%2f/i,
  /%5c/i,
  /\.\.%2f/i,
  /%252e/i,
];

export const SENSITIVE_PATH_PATTERNS: RegExp[] = [
  /etc\/passwd/i,
  /etc\/shadow/i,
  /win\.ini/i,
  /windows\\/i,
  /boot\.ini/i,
];

/** Décodage répété des encodages URL (miroir de _decode_path). */
export function decodePath(path: string): string {
  let out = path;
  for (let i = 0; i < 3; i++) {
    const next = out
      .replace(/%2e/gi, ".")
      .replace(/%2f/gi, "/")
      .replace(/%5c/gi, "\\");
    if (next === out) break;
    out = next;
  }
  return out;
}

/** Extrait les chemins d'une ligne de log HTTP (miroir de extract_paths). */
export function extractPaths(line: string): string[] {
  const paths: string[] = [];
  const re = /\b(GET|POST|PUT|DELETE|OPTIONS|PATCH)\s+(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) paths.push(m[2]);
  if (paths.length === 0) {
    for (const tok of line.split(/\s+/)) {
      if (tok.includes("../") || tok.includes("..\\") || /%2e/i.test(tok)) paths.push(tok);
    }
  }
  return paths;
}

export interface Alert {
  line_no: number;
  timestamp: string;
  path: string;
  decoded: string;
  risk: "critical" | "high" | "medium" | "low";
  reason: string;
  cwe: string;
  evidence: string;
}

/** Classifie un chemin (miroir de classify_path). */
export function classifyPath(path: string): { risk: Alert["risk"]; cwe: string; reason: string; decoded: string } {
  const decoded = decodePath(path);
  const traversal = TRAVERSAL_PATTERNS.some((p) => p.test(path) || p.test(decoded));
  const sensitive = SENSITIVE_PATH_PATTERNS.some((p) => p.test(decoded));

  let risk: Alert["risk"] = "low";
  let cwe = "-";
  if (traversal && sensitive) { risk = "critical"; cwe = "CWE-22 (Path Traversal) + fuite système"; }
  else if (traversal) { risk = "high"; cwe = "CWE-22 (Path Traversal)"; }
  else if (sensitive) { risk = "medium"; cwe = "CWE-200 (Information Exposure)"; }

  const reasons: string[] = [];
  if (traversal) reasons.push("traversal détecté");
  if (sensitive) reasons.push("chemin système sensible (etc/passwd, /etc/shadow, etc.)");
  return { risk, cwe, reason: reasons.join("; ") || "chemin normal", decoded };
}

/** Analyse une ligne de log (miroir de analyze_line). */
export function analyzeLine(line: string, idx: number): Alert[] {
  const alerts: Alert[] = [];
  for (const p of extractPaths(line)) {
    const info = classifyPath(p);
    if (info.risk === "high" || info.risk === "critical") {
      const ts = line.match(/(\d{4}-\d{2}-\d{2}[T ][\d:]{5,})/);
      alerts.push({
        line_no: idx,
        timestamp: ts ? ts[1].replace(" ", "T") : new Date().toISOString(),
        path: p,
        decoded: info.decoded,
        risk: info.risk,
        reason: info.reason,
        cwe: info.cwe,
        evidence: line.trim().slice(0, 400),
      });
    }
  }
  return alerts;
}

/** Analyse un texte / log complet et retourne le rapport structuré. */
export function analyzeText(text: string): {
  alerts: Alert[];
  summary: { total_alerts: number; critical: number; high: number; medium: number; low: number };
} {
  const alerts: Alert[] = [];
  text.split(/\r?\n/).forEach((line, i) => alerts.push(...analyzeLine(line, i + 1)));
  return {
    alerts,
    summary: {
      total_alerts: alerts.length,
      critical: alerts.filter((a) => a.risk === "critical").length,
      high: alerts.filter((a) => a.risk === "high").length,
      medium: alerts.filter((a) => a.risk === "medium").length,
      low: alerts.filter((a) => a.risk === "low").length,
    },
  };
}
