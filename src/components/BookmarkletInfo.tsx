"use client";

import { useState, useRef, useEffect } from "react";
import { generateBookmarkletCode } from "@/lib/bookmarklet";

export function BookmarkletInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Set the javascript: href via DOM to bypass React's security block
  useEffect(() => {
    if (isOpen && linkRef.current) {
      linkRef.current.href = generateBookmarkletCode(window.location.origin);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-poe-gold hover:text-poe-gold-bright transition-colors"
      >
        Import from PoE
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded border border-poe-border bg-poe-bg-panel p-4 shadow-lg">
          <h3 className="font-heading text-poe-gold-light mb-2">
            Import Progress
          </h3>
          <ol className="text-sm text-poe-text-dim space-y-2 mb-3">
            <li>
              1. Drag this link to your bookmarks bar:{" "}
              <a
                ref={linkRef}
                href="#"
                className="inline-block rounded bg-poe-gold/20 px-2 py-0.5 text-poe-gold font-medium hover:bg-poe-gold/30"
                onClick={(e) => e.preventDefault()}
              >
                PoE Import
              </a>
            </li>
            <li>2. Open your PoE challenges page</li>
            <li>3. Click the bookmarklet</li>
            <li>4. Your progress syncs automatically</li>
          </ol>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-poe-text-dim hover:text-poe-text"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
