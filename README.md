# AI Battle Arena

A beginner-friendly AI project built to learn **LangGraph**, **TypeScript**, **Express**, and **multiple AI models**.

The idea is simple:

1. User asks a question.
2. Two AI models generate answers.
3. A third AI model acts as a judge.
4. The judge scores both answers and recommends the winner.

---

# Tech Stack

## Backend

- TypeScript
- Express.js
- LangGraph
- LangChain
- Zod
- Google Gemini
- Mistral AI
- Cohere AI

## Frontend (Planned)

- React
- TypeScript
- Tailwind CSS

---

# Project Structure

```text
AI-Battle-Arena/
│
├── backend/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

# LangGraph Flow

```text
            User Question
                  │
                  ▼
             Graph.invoke()
                  │
                  ▼
           Solution Node
        ┌─────────┴─────────┐
        ▼                   ▼
    Mistral AI          Cohere AI
        │                   │
        └─────────┬─────────┘
                  ▼
          State Updated
                  │
                  ▼
             Judge Node
                  │
                  ▼
            Gemini Judge
                  │
                  ▼
         Score Both Answers
                  │
                  ▼
          Return Final State
```

---

# State

```ts
messages

solution_1

solution_2

judge_recommendation
```

---

# Learning Notes

## Step 1

Create a `StateSchema`.

The state is the shared data that travels between every LangGraph node.

Example:

```ts
const State = new StateSchema({
    messages: MessagesValue,
    solution_1: z.string().default(""),
    solution_2: z.string().default("")
});
```

---

## Step 2

Create Graph Nodes.

Each node receives the latest state.

```ts
const solutionNode: GraphNode<typeof State> = async (state) => {

}
```

Think of a node like a function.

Input:

```
state
```

Output:

```ts
return {
    solution_1: "...",
    solution_2: "..."
}
```

LangGraph automatically merges the returned object into the state.

---

## Step 3

Connect Nodes

```text
START
   │
   ▼
Solution Node
   │
   ▼
Judge Node
   │
   ▼
END
```

```ts
.addEdge(START,"solution")
.addEdge("solution","judge")
.addEdge("judge",END)
```

---

## Step 4

Invoke the graph

```ts
const result = await graph.invoke({
    messages: [
        new HumanMessage(question)
    ]
});
```

`graph.invoke()` starts execution from `START`.

---

## Solution Node

Responsibilities:

- Read the user's question
- Send it to Mistral
- Send it to Cohere
- Return both responses

```text
Question
      │
      ▼
 ┌──────────────┐
 │ Mistral AI   │
 └──────────────┘

 ┌──────────────┐
 │ Cohere AI    │
 └──────────────┘

      ▼

Return

solution_1

solution_2
```

---

## Judge Node

Responsibilities:

- Read Solution 1
- Read Solution 2
- Ask Gemini to compare them
- Store scores
- Recommend the winner

---

## Why createAgent()?

Instead of talking directly to Gemini,

```ts
geminiModel.invoke(...)
```

we create an Agent.

The Agent is a wrapper around Gemini.

It can have:

- System Prompt
- Structured Output
- Tools
- Memory (later)

Think of it like this:

```text
Your Code

      │

      ▼

    Agent

      │

      ▼

 Gemini Model
```

Gemini is the brain.

The Agent tells Gemini how to behave.

---

## Why Zod?

### StateSchema

Describes the graph state.

```ts
solution_1: z.string()
```

---

### responseFormat

Describes the AI's response.

```ts
responseFormat:
providerStrategy(
    z.object(...)
)
```

Same library.

Different purpose.

---

## System Prompt

Permanent instructions for the AI.

Example:

```
You are an AI Judge.

Compare both solutions.

Score each from 0 to 10.

Recommend the better solution.
```

---

## Human Message

The actual user request.

Example:

```
Question:
What is React?

Solution 1:
...

Solution 2:
...
```

---

# Commands

## Install

```bash
npm install
```

---

## Run

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

# Environment Variables

Create a `.env` file inside `backend`.

```env
GEMINI_API_KEY=

MISTRAL_API_KEY=

COHERE_API_KEY=
```

---

# Git

Ignore:

```
node_modules/

.env

dist/
```

---

# Future Improvements

- AI streaming
- Beautiful frontend
- Battle history
- User authentication
- Leaderboard
- Save previous battles
- Multiple judges
- More AI models
- Real-time animations
- Markdown rendering
- Syntax highlighting
- Export results

---

# Goal

This project is being built step by step to learn:

- LangGraph
- AI Workflows
- State Management
- TypeScript
- Express
- Prompt Engineering
- Multi-Agent Systems
- Building production-ready AI applications
