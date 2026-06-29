import React, { useEffect, useState } from "react";

/**
 * EditorialScoreBar — Sleek, ultra-thin progress indicator.
 */
const EditorialScoreBar = ({ label, score, maxScore = 10, fillStyle, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const pct = Math.round((score / maxScore) * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 150 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#a1a1aa] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
          {label}
        </span>
        <span className="font-bold text-[#f4f4f5]" style={{ fontFamily: "Geist Mono, monospace" }}>
          {score.toFixed(1)}
          <span className="text-[#52525b] font-normal">/10</span>
        </span>
      </div>
      <div className="score-track h-[3px] w-full">
        <div
          className="score-fill h-full"
          style={{ width: `${width}%`, ...fillStyle }}
        />
      </div>
    </div>
  );
};

/**
 * JudgeCard — Editorial referee panel displayed below model responses.
 * @param {Object}  props
 * @param {number}  props.score1
 * @param {number}  props.score2
 * @param {string}  props.winner
 * @param {string}  props.reason
 * @param {boolean} props.isLoading
 * @param {boolean} props.showContent
 */
const JudgeCard = ({ score1, score2, winner, reason, isLoading, showContent }) => {
  if (!showContent) return null;

  const winnerLabel =
    winner === "solution_1"
      ? "MISTRAL 7B"
      : winner === "solution_2"
      ? "COHERE COMMAND"
      : "DRAW DECISION";

  const winnerSubtitle =
    winner === "solution_1"
      ? "Model 1 displayed superior precision and depth."
      : winner === "solution_2"
      ? "Model 2 displayed superior clarity and practical format."
      : "Both solutions generated balanced criteria scores.";

  return (
    <div
      id="judge-card"
      className="premium-panel mt-8 animate-fade-in"
      style={{ borderStyle: "solid" }}
    >
      {/* Panel Header */}
      <div className="px-8 py-5 border-b border-[#202024] flex items-center justify-between">
        <span
          className="text-xs font-bold text-[#a1a1aa] tracking-widest"
          style={{ fontFamily: "Geist Mono, monospace" }}
        >
          REFEREE METRICS &middot; GEMINI JUDGE
        </span>
        <span
          className="text-[10px] px-2.5 py-0.5 rounded font-semibold border border-[#202024] text-[#a1a1aa]"
          style={{ fontFamily: "Geist Mono, monospace" }}
        >
          EVAL_COMPLETE
        </span>
      </div>

      {/* Main Grid: Asymmetric Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#202024]">
        {/* Left column: Referee verdict */}
        <div className="p-8 md:col-span-4 flex flex-col justify-between gap-8 bg-[#18181c]">
          <div className="space-y-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest text-[#52525b]"
              style={{ fontFamily: "Geist Mono, monospace" }}
            >
              Verdict
            </span>
            {isLoading ? (
              <div className="space-y-2 py-1">
                <div className="skeleton-line h-6 w-32" />
                <div className="skeleton-line h-4 w-48" />
              </div>
            ) : (
              <div className="space-y-1">
                <h3
                  className="text-2xl font-bold tracking-tight text-[#f4f4f5]"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {winnerLabel}
                </h3>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  {winnerSubtitle}
                </p>
              </div>
            )}
          </div>

          <div
            className="text-[10px] font-semibold text-[#52525b] tracking-wider"
            style={{ fontFamily: "Geist Mono, monospace" }}
          >
            DECISION ENGINE &middot; V2.5
          </div>
        </div>

        {/* Right column: Analytical review */}
        <div className="p-8 md:col-span-8 flex flex-col justify-between gap-8">
          {/* Analysis & Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
            {/* Detailed Scores */}
            <div className="sm:col-span-5 space-y-5">
              <span
                className="text-[10px] font-bold uppercase tracking-widest text-[#52525b] block"
                style={{ fontFamily: "Geist Mono, monospace" }}
              >
                Model Scores
              </span>
              {isLoading ? (
                <div className="space-y-4 py-1">
                  <div className="space-y-1">
                    <div className="skeleton-line h-3 w-16" />
                    <div className="skeleton-line h-2.5 w-full" />
                  </div>
                  <div className="space-y-1">
                    <div className="skeleton-line h-3 w-16" />
                    <div className="skeleton-line h-2.5 w-full" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <EditorialScoreBar
                    label="Model 1: Mistral 7B"
                    score={score1}
                    fillStyle={{ background: "#ffffff" }}
                    delay={0}
                  />
                  <EditorialScoreBar
                    label="Model 2: Cohere Command"
                    score={score2}
                    fillStyle={{ background: "#a1a1aa" }}
                    delay={100}
                  />
                </div>
              )}
            </div>

            {/* Critique paragraph */}
            <div className="sm:col-span-7 space-y-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest text-[#52525b] block"
                style={{ fontFamily: "Geist Mono, monospace" }}
              >
                Judgement Reasoning
              </span>
              {isLoading ? (
                <div className="space-y-2 py-1">
                  <div className="skeleton-line h-3.5 w-full" />
                  <div className="skeleton-line h-3.5 w-11/12" />
                  <div className="skeleton-line h-3.5 w-10/12" />
                </div>
              ) : (
                <p
                  className="text-xs text-[#a1a1aa] leading-relaxed"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {reason}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeCard;
