import React, { useState } from "react";
import LoadingSkeleton from "./LoadingSkeleton";

export const MODEL_CONFIG = {
  mistral: {
    id: "mistral",
    name: "Mistral 7B",
    icon: "🔮",
    fileName: "mistral_output.md",
    accentColor: "#f4f4f5",
  },
  cohere: {
    id: "cohere",
    name: "Cohere Command",
    icon: "🌊",
    fileName: "cohere_output.md",
    accentColor: "#a1a1aa",
  },
};

/**
 * BattleCard — Premium code-playground design for AI outputs.
 */
const BattleCard = ({ modelId, response, isLoading, isWinner, showContent }) => {
  const model = MODEL_CONFIG[modelId];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`battle-card-${modelId}`}
      className="premium-panel flex flex-col transition-all duration-300"
      style={{
        minHeight: "480px",
        borderColor: isWinner ? "#ffffff" : "#202024",
        backgroundColor: "#0d0d0f",
      }}
    >
      {/* Mock Tab Bar / Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#202024] bg-[#09090b]">
        {/* Left Side: Mock Tab */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1.5 pr-2 border-r border-[#202024]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#202024]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#202024]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#202024]" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d0d0f] border-t border-x border-[#202024] rounded-t-md -mb-2 z-10">
            <span className="text-xs text-[#a1a1aa] font-medium" style={{ fontFamily: "Geist Mono, monospace" }}>
              {model.fileName}
            </span>
            {isWinner && (
              <span
                className="text-[8px] font-bold bg-[#ffffff] text-[#09090b] px-1.5 rounded"
                style={{ fontFamily: "Geist Mono, monospace" }}
              >
                LEADING
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Copy/Actions */}
        {showContent && !isLoading && response && (
          <button
            onClick={handleCopy}
            className="text-[10px] text-[#52525b] hover:text-[#f4f4f5] transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-[#18181c]"
            style={{ fontFamily: "Geist Mono, monospace" }}
          >
            <span>{copied ? "COPIED" : "COPY_RAW"}</span>
          </button>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-8 response-viewport">
        {!showContent ? (
          /* Empty Console */
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <span className="text-3xl opacity-15 mb-3">{model.icon}</span>
            <p className="text-xs text-[#52525b] font-medium" style={{ fontFamily: "Geist Mono, monospace" }}>
              // console.stdout_pending
            </p>
          </div>
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : (
          /* Response Display */
          <div className="space-y-4">
            {/* Model Name Banner */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#18181c]">
              <span className="text-base">{model.icon}</span>
              <span
                className="text-xs font-bold text-[#f4f4f5] tracking-wider uppercase"
                style={{ fontFamily: "Geist Mono, monospace" }}
              >
                {model.name} Output
              </span>
            </div>

            <article
              className="text-sm leading-relaxed text-[#f4f4f5] font-light antialiased"
              style={{
                fontFamily: "Inter, sans-serif",
                lineHeight: "1.8",
              }}
            >
              {response}
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleCard;
