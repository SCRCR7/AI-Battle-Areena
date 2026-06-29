import { postBattleRequest } from "../api/battleApi";

/**
 * Service Layer - Coordinates business logic, error mapping, and data retrieval.
 */
const battleService = {
  /**
   * Triggers a new AI comparison battle.
   * @param {string} question - Prompt text.
   * @returns {Promise<{solution_1: string, solution_2: string, judge_recommendation: any}>}
   */
  async executeBattle(question) {
    if (!question || !question.trim()) {
      throw new Error("Invalid prompt parameter.");
    }

    try {
      const response = await postBattleRequest(question.trim());
      return response.data;
    } catch (err) {
      if (err.response) {
        // Server responded with non-2xx status code
        const details = err.response.data?.details || err.response.data?.error || "Server error";
        throw new Error(`Battle Server Error: ${details}`);
      } else if (err.request) {
        // Request made but no response received (timeout/network down)
        throw new Error("No response from battle engine. Please check if the backend is running.");
      } else {
        // Request setup error
        throw new Error(err.message || "Request initialization failed.");
      }
    }
  },
};

export default battleService;
export const executeBattle = battleService.executeBattle;
