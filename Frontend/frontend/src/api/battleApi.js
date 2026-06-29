import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const battleApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000, // 45 seconds timeout since LLMs can take some time
});

/**
 * Sends a question to the backend to run the AI battle evaluation.
 * @param {string} question - The prompt/question for the models.
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const postBattleRequest = (question) => {
  return battleApiClient.post("/use-graph", { question });
};

export default battleApiClient;
