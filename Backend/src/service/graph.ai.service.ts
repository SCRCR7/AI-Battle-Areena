import {
  StateSchema,
  MessagesValue,
  type GraphNode,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";

import { createAgent, HumanMessage, providerStrategy } from "langchain";
import { z } from "zod";

import { gemeniModel, misteralModel, cohereModel } from "./model.service.js";

// ── Graph State Schema ────────────────────────────────────────────────────────
const State = new StateSchema({
  messages: MessagesValue,
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge_recommendation: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    winner: z.enum(["solution_1", "solution_2", "draw"]).default("draw"),
    reason: z.string().default(""),
  }),
});

// ── Solution Node ─────────────────────────────────────────────────────────────
// Instructs both models to generate short, highly concise answers.
const solutionNode: GraphNode<typeof State> = async (state) => {
  const question = state.messages.at(-1)?.content;
  if (!question) throw new Error("No question found in messages");

  const concisePrompt = `
You are a competitive AI battle assistant.
Please provide a highly concise response to the user query below.
CRITICAL: Keep your response short, direct, and complete. Do NOT exceed 3 sentences or 60 words under any circumstance.

User Query:
${question}
`;

  const [misteralResponse, cohereResponse] = await Promise.all([
    misteralModel.invoke(concisePrompt),
    cohereModel.invoke(concisePrompt),
  ]);

  return {
    solution_1: misteralResponse.text,
    solution_2: cohereResponse.text,
  };
};

// ── Judge Node ────────────────────────────────────────────────────────────────
// Gemini evaluates both solutions and returns scores + winner + reasoning.
const judgeNode: GraphNode<typeof State> = async (state) => {
  const { solution_1, solution_2 } = state;
  const question = state.messages.at(-1)?.content;

  if (!question) {
    throw new Error("No question found in messages");
  }

  const judge = createAgent({
    model: gemeniModel,
    tools: [],
    agentName: "Judge",
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        recommended_solution: z.object({
          winner: z.string(),
          reason: z.string(),
        }),
      })
    ),
    systemPrompt: `
You are an AI Judge.

Compare both AI solutions based on:
1. Accuracy and correctness
2. Clarity and readability
3. Depth and completeness
4. Practical usefulness

Give each solution a score between 0 and 10.
Recommend the better solution and explain your reasoning clearly in 2-3 sentences.
If scores are within 0.5 of each other, declare a "draw".
`,
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
Question:
${question}

Solution 1 (Mistral):
${solution_1}

Solution 2 (Cohere):
${solution_2}
`),
    ],
  });

  const structured = judgeResponse.structuredResponse;
  const s1 = structured.solution_1_score;
  const s2 = structured.solution_2_score;

  // Determine winner
  let winner: "solution_1" | "solution_2" | "draw" = "draw";
  if (Math.abs(s1 - s2) > 0.5) {
    winner = s1 > s2 ? "solution_1" : "solution_2";
  }

  return {
    judge_recommendation: {
      solution_1_score: s1,
      solution_2_score: s2,
      winner,
      reason: structured.recommended_solution.reason,
    },
  };
};

// ── Graph ─────────────────────────────────────────────────────────────────────
const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();

// ── Export ────────────────────────────────────────────────────────────────────
/**
 * Runs the full battle graph for a user question.
 * Returns { solution_1, solution_2, judge_recommendation }.
 */
export default async function useGraph(userMessage: string) {
  const result = await graph.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  return {
    solution_1: result.solution_1,
    solution_2: result.solution_2,
    judge_recommendation: result.judge_recommendation,
  };
}