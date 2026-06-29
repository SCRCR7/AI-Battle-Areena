# 04 - Graph in LangGraph

# What is a Graph?

A Graph is the **controller** of your AI application.

It knows:

- Which node should run first.
- Which node should run next.
- Which data (State) should be passed.
- When the workflow should stop.

Think of the Graph as a **manager**.

The manager does not perform the work.

The workers (Nodes) perform the work.

The manager only tells them what to do and in what order.

---

# Why do we need a Graph?

Imagine our AI Battle Arena.

We have two nodes.

```
Solution Node

Judge Node
```

How does LangGraph know that the Judge should execute **after** the Solution Node?

Without a Graph

```
Solution Node

Judge Node
```

There is no connection.

Nobody knows the order.

With a Graph

```
START

↓

Solution Node

↓

Judge Node

↓

END
```

Now everything is connected.

---

# Mental Model

Imagine Google Maps.

You have

```
Home

↓

School

↓

Library

↓

Home
```

Google Maps knows which road to take.

LangGraph works the same way.

It knows which Node should execute next.

---

# Creating a Graph

```ts
const graph = new StateGraph(State)
```

This creates a new graph.

Notice we pass

```ts
State
```

Why?

Because every node in this graph will receive this State.

Think:

```
Graph

↓

Uses StateSchema

↓

All Nodes receive this State
```

---

# Breaking the Code Down

## Step 1

```ts
new StateGraph(State)
```

Create a new graph.

This graph understands our State.

Nothing executes yet.

---

## Step 2

```ts
.addNode("solution", solutionNode)
```

Register a node.

Read it like English.

> Add a node named **solution**.

The first parameter

```ts
"solution"
```

is just the node's name.

The second parameter

```ts
solutionNode
```

is the function.

Think

```
"solution"

↓

points to

↓

solutionNode()
```

---

## Step 3

```ts
.addNode("judge", judgeNode)
```

Register another node.

Now the graph knows two workers.

```
solution

judge
```

Still,

nothing has executed.

---

## Step 4

```ts
.addEdge(START, "solution")
```

Read it like English.

```
When execution starts,

go to

Solution Node.
```

Diagram

```
START

↓

Solution Node
```

---

## Step 5

```ts
.addEdge("solution", "judge")
```

Meaning

```
After Solution finishes,

run Judge.
```

Diagram

```
Solution

↓

Judge
```

---

## Step 6

```ts
.addEdge("judge", END)
```

Meaning

```
After Judge finishes,

stop.
```

Diagram

```
Judge

↓

END
```

---

## Step 7

```ts
.compile()
```

This is one of the most important steps.

Until now,

you were only describing the workflow.

Example

```ts
new StateGraph(...)

.addNode(...)

.addEdge(...)
```

Nothing has happened.

Think of it as drawing a blueprint.

When you call

```ts
.compile()
```

LangGraph builds the graph.

Now it is ready to execute.

Think

```
Blueprint

↓

Compile

↓

Working Graph
```

---

# Full Graph

```ts
const graph = new StateGraph(State)

    .addNode("solution", solutionNode)

    .addNode("judge", judgeNode)

    .addEdge(START, "solution")

    .addEdge("solution", "judge")

    .addEdge("judge", END)

    .compile();
```

This code describes the complete workflow.

---

# START

START is a special built-in node.

It represents the beginning of the graph.

You never create it yourself.

Example

```ts
.addEdge(START, "solution")
```

means

```
Execution begins here.
```

---

# END

END is another built-in node.

It represents the end of the workflow.

Example

```ts
.addEdge("judge", END)
```

means

```
After Judge finishes,

return the final State.
```

---

# graph.invoke()

After compiling,

we can execute the graph.

Example

```ts
const result = await graph.invoke({

    messages:[

        new HumanMessage(question)

    ]

});
```

This starts everything.

Think

```
graph.invoke()

↓

START

↓

Solution

↓

Judge

↓

END

↓

Return Final State
```

---

# What happens internally?

Suppose we write

```ts
await graph.invoke({

    messages:[

        new HumanMessage("What is React?")

    ]

});
```

Internally,

LangGraph does something similar to

```
Create Initial State

↓

Go to START

↓

Run Solution Node

↓

Merge Returned Values

↓

Run Judge Node

↓

Merge Returned Values

↓

Reach END

↓

Return Final State
```

This is why

we never call

```ts
solutionNode();
```

or

```ts
judgeNode();
```

The graph does everything.

---

# Graph Execution in Our Project

```
User

↓

graph.invoke()

↓

Initial State

↓

Solution Node

↓

Mistral

↓

Cohere

↓

State Updated

↓

Judge Node

↓

Gemini

↓

Judge Recommendation

↓

State Updated

↓

END

↓

Return Final State
```

---

# Common Mistakes

## Forgetting compile()

Wrong

```ts
const graph = new StateGraph(...)

.addNode(...)
```

Without

```ts
.compile()
```

the graph cannot execute.

---

## Thinking addNode executes the function

Wrong.

```ts
.addNode(...)
```

only registers the node.

It does not run it.

---

## Forgetting Edges

Nodes without edges

cannot execute.

Example

```
Solution

Judge
```

Nothing connects them.

---

## Calling Nodes manually

Wrong

```ts
solutionNode();

judgeNode();
```

Always execute

```ts
graph.invoke(...)
```

---

## Thinking START and END are real functions

They are not.

They are built-in markers used by LangGraph.

---

# Interview Questions

## What is StateGraph?

It is the class used to build a LangGraph workflow.

---

## Why do we call compile()?

To build the graph and make it executable.

---

## What does graph.invoke() do?

It starts execution from START, follows the edges, updates the State after each node, and returns the final State.

---

## What does addNode() do?

It registers a node inside the graph.

---

## What does addEdge() do?

It connects two nodes and defines the execution order.

---

## What are START and END?

They are built-in nodes representing the beginning and end of the graph.

---

# Summary

A Graph is the controller of a LangGraph application.

It does not perform AI work.

Instead,

it manages execution.

It knows

- where to start,
- where to go next,
- when to stop.

Nodes perform the work.

State carries the data.

The Graph coordinates everything.

---

# Things I Should Remember

- A Graph controls the workflow.
- `StateGraph(State)` creates a new graph.
- `addNode()` registers a node.
- `addEdge()` connects nodes.
- `START` is where execution begins.
- `END` is where execution stops.
- `compile()` builds the graph.
- `graph.invoke()` starts execution.
- Nodes never execute themselves.
- Think of the Graph as the **manager**, Nodes as the **workers**, and State as the **file** passed between workers.