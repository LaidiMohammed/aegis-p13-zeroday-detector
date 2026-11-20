"use client";

import { useEffect, useRef, useState } from "react";

export default function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => { timers.current.forEach((x) => clearTimeout(x)); timers.current = []; }, []);
  const pushTimer = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      pushTimer(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="group flex items-center justify-between gap-4 border-l-2 border-cyan/60 bg-black/30 px-4 py-3 font-mono text-[13px]">
      <code className="text-slate-200">
        <span className="text-cyan">$</span> {command}
      </code>
      <button
        onClick={copy}
        className="shrink-0 tag text-slate-500 transition group-hover:text-cyan"
        aria-label="Copier la commande"
      >
        {copied ? "✓ copié" : "copier"}
      </button>
    </div>
  );
}
