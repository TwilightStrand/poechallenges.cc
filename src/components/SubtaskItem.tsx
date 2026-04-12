"use client";

import { useState } from "react";
import type { Subtask, SubtaskProgress } from "@/schemas";
import type { PriceInfo } from "@/lib/price-lookup";
import type { TradeLink } from "@/lib/trade-links";

interface SubtaskItemProps {
  subtask: Subtask;
  progress: SubtaskProgress;
  onToggle: () => void;
  price?: PriceInfo;
  recommended?: boolean;
  tradeLink?: TradeLink;
  isLoggedIn?: boolean;
  leagueId?: string;
}

export function SubtaskItem({
  subtask,
  progress,
  onToggle,
  price,
  recommended,
  tradeLink,
  isLoggedIn,
  leagueId,
}: SubtaskItemProps) {
  const completed = progress.completed;
  const hasCounter = subtask.counterTarget !== undefined;
  const counterValue = progress.counter ?? 0;
  const [showReport, setShowReport] = useState(false);
  const [reportValue, setReportValue] = useState("");
  const [reporting, setReporting] = useState(false);

  const handleReport = async () => {
    const chaos = parseFloat(reportValue);
    if (isNaN(chaos) || chaos < 0 || !leagueId) return;

    setReporting(true);
    try {
      await fetch("/api/prices/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leagueId,
          itemName: subtask.name,
          priceChaos: chaos,
          quantity: 1,
        }),
      });
      setShowReport(false);
      setReportValue("");
    } catch {
      // Silent fail
    } finally {
      setReporting(false);
    }
  };

  return (
    <div
      className={`
        flex flex-col gap-1 w-full py-1.5 px-2 rounded transition-colors group
        ${recommended && !completed ? "bg-poe-gold/8 border border-poe-gold/20" : ""}
      `}
    >
      <div className="flex items-center gap-2">
        {/* Checkbox + name area */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          <span
            className={`
              shrink-0 w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors
              ${completed ? "border-poe-gold bg-poe-gold" : "border-poe-gold/50 bg-transparent group-hover:border-poe-gold"}
            `}
          >
            {completed && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="#0c0b0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>

          <span className={`text-sm truncate transition-colors ${completed ? "line-through text-poe-text-dim" : "text-poe-text"}`}>
            {subtask.name}
            {hasCounter && (
              <span className="ml-1 text-poe-text-dim">({counterValue}/{subtask.counterTarget})</span>
            )}
          </span>
        </button>

        {/* Right side: price + report + trade */}
        <div className="shrink-0 flex items-center gap-2">
          {price && !completed && (
            <span className="flex items-center gap-1 text-xs">
              {recommended && <span className="text-poe-green font-medium">Best</span>}
              <span className="text-poe-gold-light">{Math.round(price.totalCost)}c</span>
              <span className="text-poe-text-dim hidden sm:inline">
                ({Number(price.chaosValue.toFixed(1))}c x{price.quantity})
              </span>
            </span>
          )}

          {/* Report price button (logged in + tradeable + not completed) */}
          {isLoggedIn && tradeLink && !completed && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowReport((p) => !p); }}
              className="text-[10px] px-1.5 py-0.5 rounded border border-poe-border-subtle text-poe-text-dim hover:text-poe-gold-light hover:border-poe-border transition-colors"
              title="Report what you paid"
            >
              I paid
            </button>
          )}

          {tradeLink && !completed && (
            <a
              href={tradeLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-poe-text-dim hover:text-poe-gold transition-colors"
              title={`${tradeLink.type === "exchange" ? "Buy on" : "Search on"} PoE Trade`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Price report inline form */}
      {showReport && (
        <div className="flex items-center gap-2 ml-6" onClick={(e) => e.stopPropagation()}>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="chaos per unit"
            value={reportValue}
            onChange={(e) => setReportValue(e.target.value)}
            className="w-28 px-2 py-1 text-xs bg-poe-bg-input border border-poe-border-subtle rounded text-poe-text focus:outline-none focus:border-poe-border"
            autoFocus
          />
          <button
            onClick={handleReport}
            disabled={reporting || !reportValue}
            className="text-xs px-2 py-1 rounded bg-poe-gold/20 border border-poe-gold/30 text-poe-gold-light hover:bg-poe-gold/30 disabled:opacity-50 transition-colors"
          >
            {reporting ? "..." : "Submit"}
          </button>
          <button
            onClick={() => setShowReport(false)}
            className="text-xs text-poe-text-dim hover:text-poe-text"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
