# 07 - Agents in LangChain

# What is an Agent?

An Agent is a **smart wrapper around an AI model**.

Think of it like this:

```
AI Model

↓

Can answer questions
```

An Agent is:

```
AI Model

+

Instructions

+

Tools

+

Structured Output

+

Decision Making
```

The Agent doesn't replace the AI model.

Instead, it gives the AI model **more capabilities**.

---

# Why do we need an Agent?

Earlier we talked directly to the model.

Example

```ts
const response = await mistralModel.invoke(question);
```

This is perfect when all we need is:

- Ask a question
- Get an answer

But our Judge AI is different.

We don't want Gemini to simply answer.

We want Gemini to:

- Compare two solutions
- Score them
- Choose a winner
- Return JSON
- Follow strict rules

That is exactly why we use an Agent.

---

# Mental Model

Imagine hiring an employee.

Without instructions

```
Employee

↓

Works however they want
```

With a manager

```
Manager

↓

Employee

↓

Works according to instructions
```

The Agent is the manager.

The AI Model is the employee.

---

# Model vs Agent

Normal Model

```
Question

↓

Gemini

↓

Answer
```

Agent

```
Question

↓

Agent

↓

Gemini

↓

Structured Answer
```

The Agent sits between your code and the AI model.

---

# Why didn't we use invoke()?

Earlier

```ts
await geminiModel.invoke(question);
```

Gemini could answer anything.

Example

```
Solution 1 looks good.

Solution 2 is better.
```

But our application expects

```json
{
    "solution_1_score": 8,
    "solution_2_score": 9,
    "winner": "solution_2"
}
```

Without structure,

our application may break.

The Agent helps enforce that structure.

---

# Creating an Agent

Example

```ts
const judge = createAgent({

    model: geminiModel,

    tools: [],

    responseFormat: ...,

    systemPrompt: ...

});
```

Read it like English.

```
Create an AI Agent

Use Gemini

Follow these instructions

Return this format
```

---

# Breaking the Code Down

## model

```ts
model: geminiModel
```

This tells the Agent

which AI model it should use.

In our project

```
Agent

↓

Gemini
```

Tomorrow

you could change it to GPT or Claude

without changing the rest of your logic.

---

## tools

```ts
tools:[]
```

Tools are functions

the Agent can use.

Examples

- Calculator
- Search Google
- Read Database
- Weather API
- Send Email

Our Judge doesn't need any tools.

So

```ts
tools:[]
```

means

"No extra tools."

---

## systemPrompt

This is one of the most important concepts.

Example

```ts
systemPrompt:`

You are an AI Judge.

Compare both solutions.

Score each solution.

Choose the winner.

`
```

A System Prompt is

a permanent instruction.

Think

```
You are a Doctor.

↓

Everything afterwards

is answered

as a Doctor.
```

It controls the Agent's behaviour.

---

# Human Message vs System Prompt

Many beginners confuse these.

System Prompt

```
Who are you?

How should you behave?

What are your rules?
```

Human Message

```
What is today's task?
```

Example

System Prompt

```
You are a Judge.

Always return JSON.
```

Human Message

```
Question:

What is React?

Solution 1:

...

Solution 2:

...
```

---

# responseFormat

This is another powerful feature.

Example

```ts
responseFormat:

providerStrategy(

    z.object({

        ...

    })

)
```

Earlier

we used Zod

to describe our State.

Now

we use Zod

to describe the AI's response.

Think

```
State

↓

StateSchema

↓

Zod


AI Response

↓

responseFormat

↓

Zod
```

Same library.

Different purpose.

---

# providerStrategy()

This is a helper provided by LangChain.

It tells the AI provider

to return structured data.

Instead of

```
Solution 1 is better.

I give it 9 points.
```

the Agent tries to return

```json
{
    "solution_1_score":9,
    "solution_2_score":8
}
```

Exactly what our application expects.

---

# Invoking an Agent

Earlier

```ts
await model.invoke(question);
```

Now

```ts
const response = await judge.invoke({

    messages:[

        new HumanMessage(...)

    ]

});
```

Notice

Agents also use

```ts
invoke()
```

because internally

they still use an AI model.

---

# structuredResponse

One of the best features.

Example

```ts
const {

    solution_1_score,

    solution_2_score,

    winner

}

=

response.structuredResponse;
```

Because we defined

```ts
responseFormat
```

LangChain automatically parses the AI response.

Instead of parsing JSON ourselves,

we simply use

```ts
structuredResponse
```

---

# Our Judge Agent

```ts
const judge = createAgent({

    model: geminiModel,

    tools:[],

    responseFormat:

    providerStrategy(

        z.object({

            solution_1_score:

            z.number(),

            solution_2_score:

            z.number(),

            winner:

            z.enum([

                "solution_1",

                "solution_2",

                "draw"

            ])

        })

    ),

    systemPrompt:`

    You are an AI Judge.

    Compare both answers.

    Score each answer.

    Recommend the winner.

    `

});
```

---

# Agent Flow in Our Project

```
Question

↓

Solution Node

↓

Mistral

↓

Answer


↓

Cohere

↓

Answer


↓

Judge Node

↓

Agent

↓

Gemini

↓

Structured Response

↓

State Updated
```

---

# Common Mistakes

## Thinking Agent replaces Model

Wrong.

An Agent **uses** a Model.

---

## Forgetting systemPrompt

Without it,

the Agent has no permanent instructions.

---

## Thinking responseFormat changes State

Wrong.

It only describes

the AI response.

Not the Graph State.

---

## Confusing HumanMessage with System Prompt

System Prompt

↓

Permanent behaviour

Human Message

↓

Current task

---

## Thinking providerStrategy() validates data

Not exactly.

Zod defines the structure.

providerStrategy tells the provider

to generate output matching that structure.

---

# Interview Questions

## What is an Agent?

An Agent is a wrapper around an AI model that adds capabilities such as tools, structured output, and instructions.

---

## Why use an Agent instead of calling invoke() directly?

Because the Agent can enforce structured responses, use tools, and follow a permanent system prompt.

---

## What is a System Prompt?

A permanent instruction that defines how the AI should behave.

---

## What is responseFormat?

A schema describing the structure the AI should return.

---

## What is providerStrategy()?

A helper that instructs supported AI providers to produce structured outputs matching a schema.

---

## What is structuredResponse?

The parsed AI response that matches the schema defined in `responseFormat`.

---

# Summary

An Agent is an intelligent wrapper around an AI model.

Instead of simply asking a model a question,

we can define:

- how it should behave,
- what tools it can use,
- what format it should return,
- and how our application should receive that data.

In our AI Battle Arena,

the Judge is an Agent because we need predictable, structured scoring—not just free-form text.

---

# Things I Should Remember

- An Agent **uses** an AI Model.
- Models generate text; Agents add behavior and structure.
- `createAgent()` creates an Agent.
- `model` tells the Agent which AI model to use.
- `systemPrompt` defines permanent instructions.
- `HumanMessage` contains the current task.
- `responseFormat` defines the expected AI output.
- `providerStrategy()` helps supported providers return structured data.
- `structuredResponse` gives parsed, ready-to-use results.
- Think of the Agent as a **manager** and the AI Model as the **employee**. The manager tells the employee exactly how to work.