import DetectionTerminal from "@/components/DetectionTerminal";
import CodeSection from "@/components/CodeSection";
import CopyCommand from "@/components/CopyCommand";
import Reveal from "@/components/Reveal";

const COMMANDS = [
  "make detect",
  "make exploit",
  "make report",
  "make demo",
];

const TECHS = [
  "Python 3.11+",
  "stdlib + typings",
  "ReportLab (PDF)",
  "pytest",
  "GitHub Actions",
  "Vercel",
  "Juice Shop (local)",
  "Docker / Node",
];

const ETHICS = [
  { n: "01", t: "Local uniquement", d: "127.0.0.1 — aucune cible distante, aucune production." },
  { n: "02", t: "Zéro GPU", d: "Détecteur pur stdlib, 60 lignes, vitesse négligeable." },
  { n: "03", t: "Données anonymes", d: "Logs synthétiques, aucun dato personnel, aucune fuite." },
  { n: "04", t: "PoC documenté", d: "Traversal bloqué par serve-index (403) — adaptation expliquée." },
];

export default function Page() {
  return (
    <main className="dossier-bg min-h-screen">
      {/* ============ NAV ============ */}
      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center bg-signal font-mono text-sm font-bold text-white">P13</span>
            <span className="font-mono text-xs tracking-[0.25em] text-slate-300">ZERO-DAY / DOSSIER</span>
          </a>
          <div className="hidden gap-7 md:flex">
            {[
              ["#objectif", "Objectif"],
              ["#architecture", "Architecture"],
              ["#code", "Code"],
              ["#demo", "Démo"],
              ["#ethique", "Éthique"],
              ["#lab", "Lab"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="tag text-slate-400 transition hover:text-signal">
                {label}
              </a>
            ))}
          </div>
          <a
            href="https://github.com/LaidiMohammed/aegis-p13-zeroday-detector"
            target="_blank"
            rel="noreferrer"
            className="border border-slate-600 px-3 py-1.5 font-mono text-[11px] text-slate-300 transition hover:border-signal hover:text-signal"
          >
            GitHub ↗
          </a>
        </div>
      </nav>

      {/* ============ MARQUEE ============ */}
      <div className="overflow-hidden border-b border-slate-800/60 bg-signal/5 py-2">
        <div className="marquee-track font-mono text-[11px] uppercase tracking-[0.3em] text-signal/80">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex shrink-0 gap-10 px-5">
              <span>CWE-22 · Path Traversal</span><span>·</span>
              <span>Juice Shop local</span><span>·</span>
              <span>3 alertes critical</span><span>·</span>
              <span>0 GPU · 0 Prod · 0 Cloud</span><span>·</span>
              <span>Master 1 PFE · 2026</span><span>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ HERO ============ */}
      <section id="top" className="scanlines relative mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-24">
        <div>
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-12 bg-signal" />
              <span className="tag text-signal">Fiche technique · P13</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
              ZÉRO<span className="text-signal">-</span>DAY
              <br />
              <span className="text-slate-500">&amp; DÉTECTION</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Détection et caractérisation du <span className="text-cyan">Path Traversal</span> dans
              les logs de Juice Shop. Un détecteur léger, reproductible et éthique —
              conçu pour le mémoire de PFE.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#demo" className="bg-signal px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-ink">
                Voir la démo ↓
              </a>
              <a href="#objectif" className="border border-slate-600 px-6 py-3 font-mono text-xs uppercase tracking-widest text-slate-300 transition hover:border-cyan hover:text-cyan">
                Lire la fiche
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-slate-800 pt-6">
              {[
                ["03", "alertes critical"],
                ["60", "lignes de détecteur"],
                ["13/13", "tests réussis"],
                ["00", "GPU utilisé"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-bold text-white">{n}</div>
                  <div className="tag text-slate-500">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <DetectionTerminal />
        </Reveal>
      </section>

      {/* ============ OBJECTIF ============ */}
      <section id="objectif" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <span className="tag text-signal">01 / Fiche technique</span>
              <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Objectif &amp; périmètre</h2>
            </div>
            <span className="hidden font-mono text-xs text-slate-600 sm:block">docs/FICHE_TECHNIQUE.md</span>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="cut-card h-full p-7">
              <span className="tag text-cyan">Objectif</span>
              <p className="mt-4 text-lg leading-relaxed text-slate-200">
                Détecter et caractériser la traversal système (Path Traversal, CWE-22)
                dans le contexte de Juice Shop — données de diagnostic pour le mémoire de PFE.
              </p>
              <div className="rule my-6" />
              <p className="text-sm leading-relaxed text-slate-400">
                Le détecteur analyse un log d&apos;accès, repère les tentatives canoniques
                et encodées, puis produit un JSON d&apos;évidence exploitable par le rapport PDF.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="cut-card cyan-edge h-full p-7">
              <span className="tag text-amber">Périmètre</span>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li><span className="text-signal">▸</span> <b className="text-white">Cible :</b> Juice Shop local (127.0.0.1:3000), autorisé.</li>
                <li><span className="text-signal">▸</span> <b className="text-white">Scan :</b> traversal canonique + encodés sur <code className="text-cyan">/ftp/</code>.</li>
                <li><span className="text-signal">▸</span> <b className="text-white">Impact :</b> fuite potentielle de chemins système (etc/passwd, shadow, win.ini).</li>
                <li><span className="text-signal">▸</span> <b className="text-white">Charte :</b> application locale, pas de production, pas de sortie distante.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ARCHITECTURE ============ */}
      <section id="architecture" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <span className="tag text-signal">02 / Architecture</span>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Deux modules, un flux</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Séparation nette entre l&apos;exploit (PoC) et le détecteur — chaque module
            est exécutable en CLI et testable isolément.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <div className="cut-card mt-8 overflow-hidden p-8 font-mono text-xs leading-loose sm:text-sm">
            <pre className="whitespace-pre text-slate-300">
{`┌─────────────────────────────────────────────────┐
│           aegis-p13-zeroday-detector             │
├─────────────────────────────────────────────────┤
│  zero_day_exploit        zero_day_detector      │
│  (run_poc)               (analyze_text/log)     │
│        │                        │               │
│        ▼                        ▼               │
│   Juice Shop  ──────────►  logs (access.log)    │
│   (403 documenté)         ──► detect.json      │
└─────────────────────────────────────────────────┘`}
            </pre>
            <div className="rule my-5" />
            <div className="flex flex-wrap gap-3">
              {["src/detect.py", "src/exploit.py", "src/report.py", "src/config.py", "src/data/sample_access.log"].map((f) => (
                <span key={f} className="border border-slate-700 bg-black/30 px-3 py-1.5 text-[11px] text-cyan">{f}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ CODE SOURCE ============ */}
      <section id="code" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="tag text-signal">03 / Code source</span>
              <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Le détecteur, à nu</h2>
              <p className="mt-3 max-w-2xl text-slate-400">
                Extraits réels de <code className="text-cyan">src/detect.py</code> — le cœur de la classification CWE-22.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-600">python · stdlib · typings</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <CodeSection />
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["Efficacité", "Détecteur pur stdlib + typings — 60 lignes de logique métier, vitesse négligeable."],
              ["Crédibilité", "Traversal bloqué par serve-index (403) : adaptation documentée dans src/exploit.py."],
              ["Sortie", "JSON structuré {alerts, summary} — exit code 0 — rapport PDF via ReportLab."],
            ].map(([t, d]) => (
              <div key={t} className="border-l-2 border-cyan/50 pl-4">
                <div className="tag text-cyan">{t}</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ DEMO ============ */}
      <section id="demo" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <span className="tag text-signal">04 / Démonstration</span>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Quatre commandes, tout le flux</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Ordre recommandé pour la soutenance : détection → PoC → rapport → démo complète.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="space-y-2">
              {COMMANDS.map((c, i) => (
                <div key={c}>
                  <div className="tag mb-1 text-slate-500">0{i + 1} / {c.replace("make ", "")}</div>
                  <CopyCommand command={c} />
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="cut-card amber-edge h-full p-7">
              <span className="tag text-amber">Résultat attendu</span>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li><span className="text-amber">▸</span> <b className="text-white">detect</b> → 3 alertes <span className="text-signal">critical</span> (exit 0)</li>
                <li><span className="text-amber">▸</span> <b className="text-white">exploit</b> → URLs traversal + codes HTTP + verdicts</li>
                <li><span className="text-amber">▸</span> <b className="text-white">report</b> → rapport-p13-zeroday.<span className="text-cyan">pdf</span> + .md</li>
                <li><span className="text-amber">▸</span> <b className="text-white">demo</b> → tests + détection + PoC + rapport</li>
              </ul>
              <div className="rule my-6" />
              <div className="font-mono text-[11px] text-slate-500">
                python -m src.detect --log src/data/sample_access.log --out outputs/detect.json
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ TECH STACK ============ */}
      <section className="mx-auto max-w-7xl px-5 py-10">
        <Reveal>
          <div className="cut-card cyan-edge flex flex-wrap items-center gap-3 p-6">
            <span className="tag mr-2 text-cyan">Stacks</span>
            {TECHS.map((t) => (
              <span key={t} className="border border-slate-700 bg-black/20 px-3 py-1.5 font-mono text-[11px] text-slate-300">{t}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ============ ETHIQUE ============ */}
      <section id="ethique" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <span className="tag text-signal">05 / Charte éthique</span>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Contraintes assumées</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ETHICS.map((e, i) => (
            <Reveal key={e.n} delay={i * 80}>
              <div className="cut-card h-full p-6">
                <span className="font-display text-3xl font-bold text-signal/40">{e.n}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-white">{e.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{e.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ LAB SETUP ============ */}
      <section id="lab" className="mx-auto max-w-7xl px-5 py-16">
        <Reveal>
          <span className="tag text-signal">06 / Laboratoire</span>
          <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Autorisation &amp; téléchargements</h2>
          <p className="mt-3 max-w-2xl text-slate-400">
            Ce projet tourne sur une cible que vous possédez. Aucune autorisation externe n&apos;est requise
            en laboratoire local — mais la règle d&apos;or reste absolue.
          </p>
        </Reveal>
        <div className="cut-card amber-edge mt-8 overflow-hidden">
          <div className="grid gap-px bg-slate-800/60 sm:grid-cols-[1.1fr_1.4fr_1fr]">
            <div className="bg-panel px-5 py-3 tag text-slate-500">Outil</div>
            <div className="bg-panel px-5 py-3 tag text-slate-500">Téléchargement / installation</div>
            <div className="bg-panel px-5 py-3 tag text-slate-500">Autorisation</div>
            {[
              ["OWASP Juice Shop", "docker run -p 3000:3000 bkimminich/juice-shop · ou npm", "Aucune — cible locale 127.0.0.1"],
              ["OWASP ZAP", "Gratuit & open-source (zap.zaproxy.org)", "Aucune — uniquement vos cibles"],
              ["VMware Player", "Gratuit usage personnel (non-commercial)", "Aucune — réseau host-only"],
              ["Metasploitable2", "VM gratuite Rapid7 (SourceForge)", "Aucune — VM isolée"],
              ["DVWA", "Gratuit & open-source (DVWA GitHub)", "Aucune — labo local"],
            ].map(([tool, dl, auth]) => (
              <div key={tool} className="contents">
                <div className="bg-panel px-5 py-4 font-mono text-[12px] text-cyan">{tool}</div>
                <div className="bg-panel px-5 py-4 font-mono text-[11px] leading-relaxed text-slate-300">{dl}</div>
                <div className="bg-panel px-5 py-4 text-[12px] text-slate-400">{auth}</div>
              </div>
            ))}
          </div>
        </div>
        <Reveal delay={100}>
          <div className="mt-5 border-l-2 border-signal bg-signal/5 px-5 py-4">
            <span className="tag text-signal">Règle d&apos;or</span>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Laboratoire local sur vos propres machines/VM → <b className="text-white">aucune autorisation requise</b>.
              Dès que vous scannez un système tiers réel → <b className="text-white">autorisation écrite obligatoire</b>.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-slate-800 bg-black/40">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-10">
          <div>
            <div className="font-display text-2xl font-bold">P13 <span className="text-signal">/ ZERO-DAY</span></div>
            <div className="tag mt-1 text-slate-500">Master 1 PFE · Laidi Mohammed · 2026</div>
          </div>
          <div className="flex gap-5 font-mono text-xs text-slate-400">
            <a href="https://github.com/LaidiMohammed/aegis-p13-zeroday-detector" target="_blank" rel="noreferrer" className="transition hover:text-signal">GitHub ↗</a>
            <a href="https://aegis-p13-zeroday-detector.vercel.app" className="transition hover:text-cyan">Vercel ↗</a>
            <a href="https://owasp.org/www-project-juice-shop/" target="_blank" rel="noreferrer" className="transition hover:text-amber">Juice Shop ↗</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
