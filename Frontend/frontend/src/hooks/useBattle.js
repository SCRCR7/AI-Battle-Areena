import { useState, useCallback } from "react";
import { executeBattle } from "../services/battleService";

/**
 * Custom Hook — Orchestrates battle state transitions, API calls, and evaluation results.
 * Exposes clean state outputs and submission handlers to presentational UI components.
 */
export const useBattle = () => {
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "complete" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const [solution1, setSolution1] = useState("");
  const [solution2, setSolution2] = useState("");
  const [judgeData, setJudgeData] = useState(null);

  const startBattle = useCallback(async (question) => {
    if (!question || !question.trim()) return;

    setStatus("loading");
    setErrorMsg("");
    setSolution1("");
    setSolution2("");
    setJudgeData(null);

    try {
      const data = await executeBattle(question);
      setSolution1(data.solution_1 || "");
      setSolution2(data.solution_2 || "");
      setJudgeData(data.judge_recommendation || null);
      setStatus("complete");
    } catch (err) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus("error");
    }
  }, []);

  const resetBattle = useCallback(() => {
    setStatus("idle");
    setErrorMsg("");
    setSolution1("");
    setSolution2("");
    setJudgeData(null);
  }, []);

  return {
    status,
    isLoading: status === "loading",
    isComplete: status === "complete",
    isError: status === "error",
    errorMsg,
    solution1,
    solution2,
    judgeData,
    startBattle,
    resetBattle,
  };
};

export default useBattle;
