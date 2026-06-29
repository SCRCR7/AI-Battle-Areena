# 02 - State in LangGraph

# What is State?

State is the **shared data object** that travels through every node in a LangGraph.

Every node receives the latest version of the state.

Every node can read it.

Every node can update it.

Think of State as the **memory** of the graph.

Without State, nodes cannot communicate with each other.

---

# Why do we need State?

Imagine our AI Battle Arena.

The flow looks like this:

```text
User

↓

Solution Node

↓

Judge Node

↓

END
```

The **Solution Node** generates two AI responses.

Now ask yourself:

> How will the Judge Node know what Mistral and Cohere answered?

Without State:

```text
Solution Node

↓

(solution disappears)

↓

Judge Node
```

The judge has no idea what happened.

With State:

```text
Solution Node

↓

State stores both responses

↓

Judge Node reads them
```

State acts like a notebook that every node can read and write.

---

# Mental Model

Imagine a relay race.

Runner 1 has a baton.

```
Runner 1

↓

Runner 2

↓

Runner 3

↓

Finish
```

The baton is passed to every runner.

The baton is the **State**.

Each runner can:

- Read what's inside
- Add something
- Pass it to the next runner

---

# State in Our Project

Our project stores:

```ts
messages

solution_1

solution_2

judge_recommendation
```

Visualized:

```text
State

├── messages
├── solution_1
├── solution_2
└── judge_recommendation
```

As the graph runs, this object grows with more information.

---

# StateSchema

Before using State, we must tell LangGraph what our State looks like.

Example:

```ts
const State = new StateSchema({
    messages: MessagesValue,

    solution_1: z.string().default(""),

    solution_2: z.string().default("")
});
```

Think of `StateSchema` as a blueprint.

It answers the question:

> "What data is allowed inside the state?"

---

# Breaking the Code Down

```ts
const State = new StateSchema({
```

Create a new State definition.

---

```ts
messages: MessagesValue
```

The graph will store chat messages.

Example:

```ts
[
    HumanMessage,
    AIMessage
]
```

---

```ts
solution_1: z.string().default("")
```

Create a new field called `solution_1`.

Its type is string.

If nothing is stored yet,

its value will be:

```ts
""
```

---

```ts
solution_2: z.string().default("")
```

Exactly the same idea.

---

# What is MessagesValue?

LangGraph already provides a built-in message state called:

```ts
MessagesValue
```

It stores conversations.

Example:

```ts
messages: [
    HumanMessage("What is React?")
]
```

Later it may contain:

```ts
messages: [
    HumanMessage(...),

    AIMessage(...)
]
```

Instead of creating our own message array,

LangGraph already gives us one.

---

# How does State get into a Node?

This confuses many beginners.

We never call:

```ts
solutionNode(state)
```

Instead we call:

```ts
graph.invoke(...)
```

Example:

```ts
await graph.invoke({
    messages: [
        new HumanMessage("Hello")
    ]
});
```

LangGraph takes this object,

creates the initial State,

then automatically passes it into the first node.

Internally it is doing something similar to:

```ts
solutionNode(state);
```

You don't write this.

LangGraph does it for you.

---

# How State Changes

Initial State

```text
messages ✅

solution_1 ""

solution_2 ""
```

↓

Solution Node runs

↓

Returns

```ts
return {

    solution_1: "...",

    solution_2: "..."
}
```

↓

State becomes

```text
messages ✅

solution_1 ✅

solution_2 ✅
```

↓

Judge Node runs

↓

Returns

```ts
return {

    judge_recommendation: ...
}
```

↓

Final State

```text
messages

solution_1

solution_2

judge_recommendation
```

---

# Why don't we modify State directly?

Some beginners try:

```ts
state.solution_1 = answer;
```

Instead,

LangGraph recommends returning an object.

Example:

```ts
return {

    solution_1: answer

}
```

Why?

Because LangGraph can safely merge updates.

This makes graphs easier to manage,

especially when multiple nodes run in parallel.

---

# How LangGraph Updates State

Suppose State is:

```ts
{

    messages: [...],

    solution_1: "",

    solution_2: ""

}
```

Your node returns:

```ts
return {

    solution_1: "React is a library."

}
```

LangGraph automatically merges it.

Final State:

```ts
{

    messages: [...],

    solution_1: "React is a library.",

    solution_2: ""

}
```

Notice that only `solution_1` changed.

Everything else stayed the same.

---

# Example From Our Project

Before Solution Node

```text
State

messages ✅

solution_1 ""

solution_2 ""
```

↓

After Solution Node

```text
State

messages ✅

solution_1 "Mistral Answer"

solution_2 "Cohere Answer"
```

↓

Judge Node reads:

```ts
state.solution_1

state.solution_2
```

without generating them again.

---

# Common Mistakes

## Forgetting to return updates

Wrong

```ts
state.solution_1 = answer;
```

Preferred

```ts
return {

    solution_1: answer

}
```

---

## Creating lots of variables

Wrong

```ts
let solution1

let solution2

let winner
```

Store everything inside State.

---

## Thinking every node has its own State

Wrong.

There is only **one shared State**.

Each node receives the latest version.

---

## Forgetting default values

Without `.default()`

your field may be undefined.

Using:

```ts
z.string().default("")
```

ensures the field always starts with a value.

---

# Interview Questions

## What is State?

State is the shared object that travels through every node in a LangGraph.

---

## Why do we need State?

It allows nodes to share data without directly calling each other.

---

## What is StateSchema?

A blueprint describing what data the State can contain.

---

## Does graph.invoke() pass State automatically?

Yes.

The object passed to `graph.invoke()` becomes the initial State,

which LangGraph automatically provides to each node.

---

## Why do nodes return objects?

LangGraph merges the returned object into the existing State,

making updates predictable and safe.

---

# Summary

State is the heart of every LangGraph application.

It carries information from one node to another.

Nodes never communicate directly.

Instead,

they communicate through the shared State.

Each node reads the latest State,

returns updates,

and LangGraph merges those updates automatically.

---

# Things I Should Remember

- State is the shared memory of the graph.
- Every node receives the latest State.
- Every node can read the State.
- Nodes return updates instead of replacing the entire State.
- LangGraph automatically merges returned values.
- `graph.invoke()` creates the initial State.
- `StateSchema` defines the structure of the State.
- `MessagesValue` is LangGraph's built-in conversation storage.
- State is passed automatically to every node.
- Think of State as a **baton in a relay race** that moves through every node.