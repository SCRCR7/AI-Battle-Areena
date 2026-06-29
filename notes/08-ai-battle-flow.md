# 09 - AI Battle Arena Flow

# What is the AI Battle Arena Flow?

The AI Battle Arena Flow is the **complete journey** of a user's question through our application.

It shows **how every concept we learned works together**.

Before this chapter we learned:

- LangGraph Basics
- State
- Nodes
- Graph
- Zod
- Models
- Agents
- Judge

Now we'll combine everything into one complete picture.

---

# Goal of the Project

The goal is simple.

A user asks one question.

Instead of asking **one AI**, we ask **multiple AI models**.

Then another AI compares their answers and recommends the best one.

Finally, the frontend displays everything.

---

# High Level Flow

```
User

↓

Backend API

↓

LangGraph

↓

Solution Node

↓

Mistral + Cohere

↓

State Updated

↓

Judge Node

↓

Gemini Judge

↓

State Updated

↓

Return Final State

↓

Frontend
```

Everything revolves around the **State**.

---

# Step 1 - User Asks a Question

Suppose the user asks

```
Explain React in simple words.
```

The frontend sends a request to the backend.

Example

```http
POST /battle

{
    "question":"Explain React in simple words."
}
```

---

# Step 2 - Backend Receives the Request

Express receives the request.

Example

```ts
app.post("/battle", async (req, res) => {

    const result = await useGraph(

        req.body.question

    );

    res.json(result);

});
```

Nothing AI-related has happened yet.

We simply received the user's question.

---

# Step 3 - graph.invoke()

The backend starts the LangGraph workflow.

Example

```ts
await graph.invoke({

    messages:[

        new HumanMessage(question)

    ]

});
```

LangGraph now creates the initial State.

---

# Initial State

Before any node runs

the State looks something like

```ts
{

    messages:[

        HumanMessage(question)

    ],

    solution_1:"",

    solution_2:"",

    judge_recommendation:{

        solution_1_score:0,

        solution_2_score:0,

        recommended_solution:{}

    }

}
```

Only the user's question exists.

Everything else is empty.

---

# Step 4 - START

The Graph begins.

```
START

↓

Solution Node
```

START is just the beginning of the workflow.

---

# Step 5 - Solution Node Executes

The Solution Node receives the current State.

```
State

↓

Solution Node
```

It extracts the user's question.

Example

```ts
const question =

state.messages.at(-1)?.content;
```

Now the Solution Node has the question.

---

# Step 6 - Two AI Models Answer

Both models receive the same question.

```
Question

↓

Mistral

↓

Answer


Question

↓

Cohere

↓

Answer
```

We run both simultaneously.

```ts
Promise.all([

    mistralModel.invoke(question),

    cohereModel.invoke(question)

]);
```

---

# Step 7 - Solution Node Returns Data

Example

```ts
return{

    solution_1:

    mistralResponse.text,

    solution_2:

    cohereResponse.text

}
```

Notice

We never update the State manually.

---

# Step 8 - LangGraph Updates the State

LangGraph automatically merges the returned values.

The State becomes

```ts
{

    messages:[...],

    solution_1:"...",

    solution_2:"...",

    judge_recommendation:{...}

}
```

Now both AI responses exist.

---

# Step 9 - Graph Moves to Judge Node

The Graph already knows

```
Solution

↓

Judge
```

because we created this edge.

```ts
.addEdge(

    "solution",

    "judge"

)
```

The Judge Node now receives the updated State.

---

# Step 10 - Judge Reads the State

Inside the Judge Node

```ts
const {

    solution_1,

    solution_2

}

=

state;
```

It also reads

```ts
question
```

Now it has

- Question
- Solution 1
- Solution 2

---

# Step 11 - Judge Agent Evaluates

The Judge Agent receives

```
Question

Solution 1

Solution 2
```

Gemini compares both answers.

It scores them.

It chooses the winner.

Example

```json
{

    "solution_1_score":8,

    "solution_2_score":9,

    "winner":"solution_2"

}
```

---

# Step 12 - Judge Returns Structured Data

The Judge Node returns

```ts
return{

    judge_recommendation:

    judgeResponse.structuredResponse

}
```

Again,

LangGraph automatically updates the State.

---

# Final State

After the Judge finishes

the State becomes

```ts
{

    messages:[...],

    solution_1:"...",

    solution_2:"...",

    judge_recommendation:{

        solution_1_score:8,

        solution_2_score:9,

        recommended_solution:{

            winner:"solution_2"

        }

    }

}
```

Now the graph reaches

```
END
```

---

# Step 13 - END

```
Judge

↓

END
```

The workflow finishes.

LangGraph returns the final State.

---

# Step 14 - Backend Sends Response

Example

```ts
res.json(result);
```

Now the frontend receives

```json
{

    "solution_1":"...",

    "solution_2":"...",

    "judge_recommendation":{

        ...

    }

}
```

---

# Step 15 - Frontend Displays Everything

The frontend shows

```
Question

↓

Solution 1

↓

Solution 2

↓

Scores

↓

Winner
```

The user can compare both answers and immediately see which one the Judge recommends.

---

# Complete Visual Flow

```text
Frontend

↓

Express API

↓

graph.invoke()

↓

Initial State Created

↓

START

↓

Solution Node

↓

Read Question

↓

Mistral.invoke()

↓

Answer


↓

Cohere.invoke()

↓

Answer


↓

Return

↓

State Updated

↓

Judge Node

↓

Read State

↓

Judge Agent

↓

Gemini

↓

Structured Response

↓

Return

↓

State Updated

↓

END

↓

Final State Returned

↓

Express Response

↓

Frontend UI
```

---

# Where Each Concept Fits

## LangGraph

Controls the workflow.

---

## State

Stores shared data.

---

## Nodes

Perform individual tasks.

---

## Graph

Decides execution order.

---

## Zod

Defines and validates data structures.

---

## Models

Generate answers.

---

## Agent

Evaluates the answers.

---

## Judge Node

Stores the evaluation.

Everything works together.

---

# Why is this architecture good?

Every part has **one responsibility**.

```
Solution Node

↓

Generate answers
```

```
Judge Node

↓

Evaluate answers
```

If tomorrow you want to add another AI model,

you only modify the Solution Node.

If you want better scoring,

you only modify the Judge Node.

Each part stays independent.

---

# Common Mistakes

## Thinking Nodes share variables

They don't.

They only share the **State**.

---

## Updating State manually

Never do this.

Always return an object.

LangGraph merges it automatically.

---

## Forgetting the execution order

Execution is determined by

```ts
addEdge()
```

not by the order in which nodes are written in the file.

---

## Thinking graph.invoke() only runs one node

It runs the **entire graph** until it reaches `END`.

---

# Interview Questions

## Explain the flow of your AI Battle Arena project.

A user's question is sent to the backend, which starts a LangGraph workflow. The Solution Node sends the question to Mistral and Cohere in parallel and stores both responses in the State. The Judge Node reads the updated State, asks Gemini to compare the responses, stores the evaluation, and the final State is returned to the frontend.

---

## Why did you use LangGraph?

To orchestrate multiple AI models using a shared State and a clear workflow.

---

## Why use multiple AI models?

Different models can produce different answers. Comparing them often results in a higher-quality final recommendation.

---

## Why separate Solution and Judge Nodes?

Each node has a single responsibility, making the application easier to maintain and extend.

---

## What is returned from graph.invoke()?

The final State after every node has executed and the graph reaches `END`.

---

# Summary

The AI Battle Arena is built around one simple idea:

Ask multiple AI models the same question, compare their responses using another AI, and return the best recommendation.

LangGraph orchestrates the workflow.

State carries the data.

Nodes perform specific tasks.

Models generate answers.

The Agent evaluates those answers.

Everything works together to produce one final result.

---

# Things I Should Remember

- The frontend only sends the user's question.
- `graph.invoke()` starts the workflow.
- LangGraph creates the initial State.
- The Solution Node generates two answers.
- `Promise.all()` runs both models in parallel.
- Returning an object updates the State automatically.
- The Judge Node reads the updated State.
- Gemini evaluates both solutions through an Agent.
- LangGraph updates the State again with the judge's recommendation.
- The graph reaches `END` and returns the final State.
- The backend sends the final State to the frontend.
- **State is the single source of truth** throughout the entire workflow.