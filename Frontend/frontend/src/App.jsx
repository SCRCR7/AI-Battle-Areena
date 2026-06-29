import React from "react";
import Header from "./components/Header";
import PromptInput from "./components/PromptInput";
import BattleCard from "./components/BattleCard";
import JudgeCard from "./components/JudgeCard";
import useBattle from "./hooks/useBattle";

const App = () => {
  const {
    status,
    isLoading,
    isError,
    errorMsg,
    solution1,
    solution2,
    judgeData,
    startBattle,
  } = useBattle();

  const showContent = status === "loading" || status === "complete";

  return (
    <div className="grid-bg min-h-screen pb-24 flex flex-col bg-[#09090b]">
      {/* Top Header */}
      <Header />

      {/* Hero / Welcome Intro */}
      <section className="relative z-10 px-8 pt-8 pb-4 text-center max-w-4xl mx-auto space-y-4">
        <h2
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#f4f4f5]"
          style={{ fontFamily: "Sora, sans-serif" }}
        >
          Compare AI models side by side.
        </h2>
        <p className="text-sm sm:text-base text-[#a1a1aa] max-w-xl mx-auto leading-relaxed">
          Submit a prompt to run concurrent generation threads on independent models. 
          A third-party referee evaluative agent evaluates and scores both outputs.
        </p>
      </section>

      {/* Central Input Console */}
      <PromptInput onSubmit={startBattle} isLoading={isLoading} />

      {/* Error Alert Display */}
      {isError && (
        <div className="relative z-10 px-8 mb-10 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="border border-red-950/40 bg-red-950/15 rounded p-4 text-xs font-semibold flex items-center gap-3">
              <span className="text-red-500 text-sm">⚠</span>
              <div className="space-y-1">
                <p className="text-red-200">SYSTEM EVALUATION EXCEPTION</p>
                <p className="text-[#a1a1aa] font-normal leading-relaxed">
                  {errorMsg}. Verify that target services are online.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Battle Zone */}
      {showContent && (
        <section
          id="battle-arena"
          className="relative z-10 px-8 max-w-7xl mx-auto w-full animate-fade-in"
        >
          {/* Main Dual-column comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BattleCard
              modelId="mistral"
              response={solution1}
              isLoading={isLoading}
              isWinner={judgeData?.winner === "solution_1"}
              showContent={showContent}
            />
            <BattleCard
              modelId="cohere"
              response={solution2}
              isLoading={isLoading}
              isWinner={judgeData?.winner === "solution_2"}
              showContent={showContent}
            />
          </div>

          {/* Full-width referee panel below */}
          <JudgeCard
            score1={judgeData?.solution_1_score ?? 0}
            score2={judgeData?.solution_2_score ?? 0}
            winner={judgeData?.winner}
            reason={judgeData?.reason}
            isLoading={isLoading}
            showContent={showContent}
          />
        </section>
      )}
    </div>
  );
};

export default App;
