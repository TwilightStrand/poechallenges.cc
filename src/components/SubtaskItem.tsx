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

  const textColor = completed ? "poe-subtask-done" : "poe-subtask-todo";

  return (
    <div
      className={`
        flex flex-col gap-0.5 py-1 px-2 rounded transition-colors
        ${recommended && !completed ? "bg-poe-gold/8 border border-poe-gold/20" : "hover:bg-poe-bg-card-hover/50"}
      `}
    >
      <div className="flex items-center gap-2">
        {/* Name + counter, clickable */}
        <button
          type="button"
          onClick={onToggle}
          className={`flex-1 min-w-0 text-left text-sm ${textColor}`}
        >
          <span>{subtask.name}</span>
          {hasCounter && (
            <span className="ml-1 opacity-75">
              ({counterValue}/{subtask.counterTarget})
            </span>
          )}
          {completed && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              className="inline-block ml-1.5 -mt-0.5"
            >
              <path
                d="M2 7.5L5.5 11L12 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Right side: price + report + trade */}
        <div className="shrink-0 flex items-center gap-1.5">
          {price && !completed && (
            <span className="flex items-center gap-1 text-xs">
              {recommended && <span className="text-poe-green font-medium">Best</span>}
              <span className="text-poe-gold-light">{Math.round(price.totalCost)}c</span>
            </span>
          )}

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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {showReport && (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <input
            type="number"
            min="0"
            step="0.1"
            placeholder="chaos per unit"
            value={reportValue}
            onChange={(e) => setReportValue(e.target.value)}
            className="w-24 px-2 py-0.5 text-xs bg-poe-bg-input border border-poe-border-subtle rounded text-poe-text focus:outline-none focus:border-poe-border"
            autoFocus
          />
          <button
            onClick={handleReport}
            disabled={reporting || !reportValue}
            className="text-xs px-2 py-0.5 rounded bg-poe-gold/20 border border-poe-gold/30 text-poe-gold-light hover:bg-poe-gold/30 disabled:opacity-50 transition-colors"
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
