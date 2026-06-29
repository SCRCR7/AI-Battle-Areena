import React from "react";

/**
 * Header component — Highly minimalist, clean navigation styling.
 */
const Header = () => {
  return (
    <header className="relative z-10 pt-12 pb-8 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Brand */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xl select-none" aria-hidden="true">⚔️</span>
            <span
              className="text-lg font-bold tracking-tight text-[#f4f4f5]"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              arena.ai
            </span>
          </div>
          <p className="text-xs text-[#a1a1aa] font-medium tracking-wide">
            Model comparison system &middot; Gemini Judge referee
          </p>
        </div>

        {/* System parameters */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#202024] text-[10px] font-semibold text-[#a1a1aa]"
            style={{ fontFamily: "Geist Mono, monospace" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] status-dot" />
            LANGGRAPH_ENGINE_CONNECTED
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
