# 01 - LangGraph Basics

# What is LangGraph?

LangGraph is a framework built on top of LangChain that helps us create AI workflows using a graph.

Instead of writing one long function that does everything, we divide the work into small pieces called **Nodes**. These nodes are connected together to form a **Graph**.

Each node performs one specific task, and data travels between nodes using a shared object called **State**.

Think of LangGraph as a traffic controller. It decides:

- Which node runs first
- Which node runs next
- What data each node receives
- When the workflow is finished

---

# Why was LangGraph Created?

Before LangGraph, developers usually wrote AI applications like this:

```ts
const answer = await model.invoke(question);
return answer;
```

This works for simple applications.

But what if your application needs to:

- Use multiple AI models?
- Save previous responses?
- Retry failed requests?
- Ask a human for approval?
- Call tools?
- Make decisions based on previous outputs?

A single function quickly becomes messy.

Example:

```text
User

↓

Model 1

↓

Model 2

↓

Compare

↓

Judge

↓

Store Result

↓

Return Response
```

Managing all of this with normal functions becomes difficult.

LangGraph solves this by organizing everything into a graph.

---

# Why not just use LangChain?

LangChain is excellent for interacting with AI models.

Example:

```ts
const response = await model.invoke(question);
```

But LangChain does **not** manage complex workflows very well.

LangGraph extends LangChain by adding:

- State management
- Nodes
- Execution flow
- Conditional paths
- Loops
- Human-in-the-loop
- Persistence

Think of it like this:

```text
LangChain
──────────
Talk to AI

LangGraph
──────────
Control the entire AI workflow
```

---

# What is a Graph?

A graph is simply a collection of connected nodes.

Example:

```text
START

↓

Node A

↓

Node B

↓

END
```

Each arrow represents the path that execution follows.

---

# Main Concepts

There are only a few concepts you need to understand.

## 1. State

State is the shared object that travels between every node.

Every node receives the latest state.

Every node can update the state.

Example:

```ts
{
    messages: [...],
    solution_1: "",
    solution_2: ""
}
```

---

## 2. Nodes

A Node is simply a function.

It receives the current state.

It performs some work.

It returns updated values.

Example:

```ts
const solutionNode = async (state) => {

    return {
        solution_1: "...",
        solution_2: "..."
    }

}
```

Think:

```
Input State

↓

Do Work

↓

Return Updated State
```

---

## 3. Edges

Edges connect nodes.

Example:

```text
START

↓

Solution Node

↓

Judge Node

↓

END
```

Without edges, LangGraph doesn't know which node should execute next.

---

## 4. START

START is the beginning of the graph.

Execution always starts here.

Example:

```text
START

↓

Solution Node
```

---

## 5. END

END marks the completion of the graph.

Once execution reaches END, the graph returns the final state.

Example:

```text
Judge Node

↓

END
```

---

# Mental Model

Imagine a factory.

```
User Question

↓

Worker 1

↓

Worker 2

↓

Quality Inspector

↓

Finished Product
```

Each worker performs one task.

Nobody does everything.

LangGraph works exactly like this.

Each Node is one worker.

The State is the package moving between workers.

---

# Syntax

Creating a State

```ts
const State = new StateSchema({
    messages: MessagesValue
});
```

Creating a Node

```ts
const node: GraphNode<typeof State> = (state) => {

};
```

Creating the Graph

```ts
const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addEdge(START, "solution")
    .addEdge("solution", END)
    .compile();
```

Running the Graph

```ts
const result = await graph.invoke({
    messages: [
        new HumanMessage("Hello")
    ]
});
```

---

# Breaking the Code Down

```ts
const graph = new StateGraph(State)
```

Create a new graph.

The graph will use our StateSchema.

---

```ts
.addNode("solution", solutionNode)
```

Register a node.

The graph now knows there is a node named **solution**.

---

```ts
.addEdge(START, "solution")
```

When execution begins,

run the **solution** node first.

---

```ts
.addEdge("solution", END)
```

After the solution node finishes,

end the graph.

---

```ts
.compile()
```

Build the graph.

The graph is now ready to execute.

---

```ts
graph.invoke(...)
```

Start the graph.

Execution begins at START.

---

# Example (Our AI Battle Arena)

```text
User

↓

graph.invoke()

↓

Solution Node

↓

Mistral AI
Cohere AI

↓

State Updated

↓

Judge Node

↓

Gemini Judge

↓

State Updated

↓

END

↓

Final State Returned
```

The user never calls the nodes directly.

The graph controls everything.

---

# Common Mistakes

### Thinking LangGraph is an AI model

❌ Wrong

LangGraph does **not** generate answers.

AI models generate answers.

LangGraph only controls the workflow.

---

### Thinking Nodes call each other

❌ Wrong

Nodes never call each other directly.

The Graph decides which node runs next.

---

### Forgetting State

Some beginners try this:

```ts
let solution = "";
```

Instead, store everything inside the graph state.

---

### Returning nothing

A node should return the values it wants to update.

Example:

```ts
return {
    solution_1: answer
}
```

---

# Interview Questions

### What is LangGraph?

A framework for building stateful AI workflows using graphs.

---

### What is a Node?

A function that receives the current state, performs work, and returns updated values.

---

### What is State?

A shared object that travels between every node.

---

### Why use LangGraph instead of plain LangChain?

LangChain focuses on interacting with AI models.

LangGraph manages complex workflows involving multiple steps, branching, retries, and shared state.

---

### What happens when graph.invoke() is called?

The graph starts executing from START, follows the edges, updates the state after each node, and returns the final state when it reaches END.

---

# Summary

LangGraph helps us organize AI applications into small reusable steps.

Instead of writing one huge function, we create nodes connected together as a graph.

The graph manages execution.

State carries data between nodes.

Nodes update the state.

When execution reaches END, the final state is returned.

---

# Things I Should Remember

- LangGraph is **not** an AI model.
- LangGraph controls the workflow.
- Nodes are just functions.
- State is shared between every node.
- Edges decide execution order.
- Execution always starts at START.
- Execution ends at END.
- `graph.invoke()` starts the workflow.
- Nodes return updates, not the whole state.
- LangGraph automatically merges returned values into the state.
- Think of LangGraph as the **director**, Nodes as the **workers**, and State as the **package** moving between workers.