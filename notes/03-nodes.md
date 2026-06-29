# 03 - Nodes in LangGraph

# What is a Node?

A Node is simply a **function**.

That's it.

It receives the current **State**, performs one specific task, and returns any updates to the State.

Think of a node as one worker in a factory.

It should have **one responsibility**.

Examples:

- Generate an AI response
- Search the web
- Save data
- Judge two answers
- Call an API

A node should **not** do everything.

---

# Why do we need Nodes?

Imagine writing our AI Battle Arena without nodes.

```ts
async function battle(question){

    // Generate solution 1

    // Generate solution 2

    // Compare them

    // Save database

    // Return result

}
```

This works for small projects.

But imagine adding:

- Authentication
- Memory
- Database
- File Uploads
- More AI models
- Retry Logic

One function becomes huge.

Instead we divide everything.

```text
Question

↓

Solution Node

↓

Judge Node

↓

Database Node

↓

END
```

Each node has only one job.

---

# Mental Model

Imagine a restaurant.

```
Customer

↓

Waiter

↓

Chef

↓

Cashier

↓

Customer
```

The waiter doesn't cook.

The chef doesn't take payment.

The cashier doesn't prepare food.

Each worker has one responsibility.

Nodes work exactly the same way.

---

# Syntax

Creating a node

```ts
const solutionNode: GraphNode<typeof State> = (state)=>{

}
```

---

# Breaking the Code Down

```ts
const solutionNode
```

This is just a normal variable.

Inside it we store a function.

---

```ts
GraphNode<typeof State>
```

This tells TypeScript:

> This function is a LangGraph Node.

It also tells TypeScript

what State this node will receive.

---

```ts
(state)
```

This is the current State.

You never pass it yourself.

LangGraph passes it automatically.

---

```ts
(state)=>{
```

This is simply an Arrow Function.

Nothing special.

LangGraph calls it internally.

---

# Where does state come from?

This confused us earlier.

We only write:

```ts
await graph.invoke({

    messages:[
        new HumanMessage("Hello")
    ]

});
```

We never write:

```ts
solutionNode(state);
```

Internally LangGraph does something similar to:

```ts
const state = {

    messages:[
        new HumanMessage("Hello")
    ]

}

solutionNode(state);
```

You never call the node.

The Graph does.

---

# Reading State

Suppose State is

```ts
{

    messages:[...]

}
```

Inside the node

```ts
const solutionNode = (state)=>{

    console.log(state.messages);

}
```

We can access

```ts
state.messages
```

just like any normal object.

---

# Returning Updates

Suppose Mistral generates

```text
React is a JavaScript library.
```

Return

```ts
return{

    solution_1:mistralResponse.text

}
```

LangGraph automatically updates the State.

---

# Why return instead of modifying?

Wrong

```ts
state.solution_1 = answer;
```

Preferred

```ts
return{

    solution_1:answer

}
```

Why?

Because LangGraph merges updates safely.

---

# Async Nodes

Most AI work is asynchronous.

Example

```ts
const solutionNode: GraphNode<typeof State> = async(state)=>{

}
```

Now we can use

```ts
await
```

inside the node.

Example

```ts
const response = await model.invoke(question);
```

---

# Our Solution Node

```ts
const solutionNode: GraphNode<typeof State> = async(state)=>{

    const question = state.messages.at(-1)?.content;

    if(!question){

        throw new Error("No question");

    }

    const [

        mistralResponse,

        cohereResponse

    ] = await Promise.all([

        mistralModel.invoke(question),

        cohereModel.invoke(question)

    ]);

    return{

        solution_1:mistralResponse.text,

        solution_2:cohereResponse.text

    };

}
```

---

# Breaking Our Solution Node Down

### Read the user's question

```ts
const question = state.messages.at(-1)?.content;
```

Get the latest message from the conversation.

---

### Validate

```ts
if(!question){

    throw new Error(...);

}
```

Never send undefined to an AI model.

---

### Call both models

```ts
Promise.all([...])
```

Run both AI models simultaneously.

This is faster than

```ts
await model1

await model2
```

---

### Return

```ts
return{

    solution_1:...,

    solution_2:...

}
```

LangGraph updates the shared State automatically.

---

# Judge Node

The Judge Node is another function.

```ts
const judgeNode: GraphNode<typeof State> = async(state)=>{

}
```

Notice

Same syntax.

Different responsibility.

Instead of generating answers,

it reads existing answers.

```ts
state.solution_1

state.solution_2
```

Then asks Gemini to compare them.

---

# Multiple Nodes

Our graph

```text
START

↓

Solution Node

↓

Judge Node

↓

END
```

Execution order

```
Graph

↓

Solution Node

↓

State Updated

↓

Judge Node

↓

State Updated

↓

END
```

Each node receives the latest State.

---

# Common Mistakes

## Thinking Nodes call each other

Wrong

```ts
solutionNode();

judgeNode();
```

Never.

The Graph controls execution.

---

## Returning nothing

Wrong

```ts
const node = ()=>{

}
```

If you want to update State,

return an object.

---

## One huge node

Don't put

- AI generation
- Database
- Judge
- Authentication

inside one node.

Create separate nodes.

---

## Forgetting async

If you call

```ts
await model.invoke(...)
```

your node must be

```ts
async
```

---

# Interview Questions

## What is a Node?

A Node is a function that receives the current State, performs one task, and returns updates.

---

## Who calls the Node?

LangGraph.

Not the developer.

---

## Can a Node be async?

Yes.

Most AI nodes are asynchronous because they call external APIs.

---

## What should a Node return?

Only the fields it wants to update.

LangGraph merges them into the existing State.

---

## Should one Node do everything?

No.

Each node should have a single responsibility.

---

# Summary

A Node is simply a function.

It receives State.

It performs one task.

It returns updates.

Nodes never call each other.

The Graph controls execution.

State is automatically passed into every node.

LangGraph merges whatever the node returns.

---

# Things I Should Remember

- A Node is just a function.
- Every Node receives the latest State.
- LangGraph calls the Node automatically.
- Nodes should have one responsibility.
- Return updates instead of modifying State directly.
- AI Nodes are usually async.
- `GraphNode<typeof State>` tells TypeScript what State the node receives.
- Nodes never call other nodes.
- Think of a Node as a **worker in a factory** doing one specific job.