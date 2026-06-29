# 05 - Zod

# What is Zod?

Zod is a **TypeScript-first schema validation library**.

That sounds complicated, but the idea is simple.

Zod helps us **describe the shape of our data** and **validate** that the data matches that shape while the program is running.

Think of Zod as a **security guard**.

Before data enters your application, Zod checks:

- Is it a string?
- Is it a number?
- Is it an object?
- Is anything missing?
- Does it follow the rules?

If everything is correct, the data is allowed through.

Otherwise, Zod throws an error.

---

# Why do we need Zod?

Many beginners ask:

> "I already have TypeScript. Why do I need Zod?"

This is one of the most important concepts to understand.

TypeScript only checks types **while you're writing code**.

After your code is compiled into JavaScript...

TypeScript disappears.

Example

```ts
let name: string = "Hassan";
```

After compilation

```js
let name = "Hassan";
```

Notice...

There is **no string type anymore**.

TypeScript does **not exist at runtime**.

---

# Runtime vs Compile Time

### Compile Time

This happens before your program runs.

TypeScript checks your code.

Example

```ts
let age: number = "20";
```

TypeScript immediately says

❌ Error

because `"20"` is not a number.

---

### Runtime

Now imagine data coming from

- User input
- APIs
- AI models
- Databases

TypeScript cannot check these values because they arrive **after the program starts running**.

That's where Zod comes in.

---

# Mental Model

Imagine airport security.

Passengers are data.

Airport security is Zod.

```
Data

↓

Zod checks everything

↓

Valid

↓

Application
```

If something is wrong...

```
Data

↓

Zod

↓

❌ Rejected
```

---

# Why do we use Zod in AI?

AI models are unpredictable.

Suppose you ask Gemini

> Score both solutions.

You expect

```json
{
  "solution_1_score": 9,
  "solution_2_score": 8
}
```

But AI might return

```text
Solution 1 is pretty good.

I think it deserves nine points.
```

Your code now breaks.

Instead,

we tell the AI

```
Return THIS structure.
```

using Zod.

---

# Basic Types

## String

```ts
z.string()
```

Accepts

```ts
"Hassan"
```

Rejects

```ts
123
```

---

## Number

```ts
z.number()
```

Accepts

```ts
25
```

Rejects

```ts
"25"
```

---

## Boolean

```ts
z.boolean()
```

Accepts

```ts
true

false
```

Rejects

```ts
"true"
```

---

# Objects

Objects are created using

```ts
z.object()
```

Example

```ts
const User = z.object({

    name: z.string(),

    age: z.number()

});
```

Expected

```json
{
    "name":"Hassan",

    "age":22
}
```

---

# Arrays

```ts
z.array(z.string())
```

Expected

```ts
["React","Node","TypeScript"]
```

---

# Nested Objects

Our project

```ts
judge_recommendation:

z.object({

    solution_1_score:z.number(),

    solution_2_score:z.number(),

    recommended_solution:

    z.object({

        winner:z.string()

    })

})
```

Objects can contain other objects.

---

# Enum

Sometimes

we only allow certain values.

Example

```ts
z.enum([

    "solution_1",

    "solution_2",

    "draw"

]);
```

Now

only these three values are allowed.

Anything else is rejected.

This is much safer than

```ts
z.string()
```

---

# Default Values

One thing we used a lot

```ts
z.string().default("")
```

What does it mean?

Imagine

```ts
solution_1
```

hasn't been generated yet.

Without a default

```
undefined
```

With

```ts
.default("")
```

LangGraph automatically starts with

```ts
""
```

Same idea

```ts
z.number().default(0)
```

starts with

```ts
0
```

---

# Zod in StateSchema

We used

```ts
const State = new StateSchema({

    solution_1:

    z.string().default(""),

    solution_2:

    z.string().default("")

});
```

What does this mean?

It tells LangGraph

```
State must contain

solution_1

solution_2

Both are strings

Both start as ""
```

---

# Zod in createAgent()

We also used Zod here

```ts
responseFormat:

providerStrategy(

    z.object({

        solution_1_score:

        z.number(),

        solution_2_score:

        z.number()

    })

)
```

This is a different purpose.

Earlier

Zod described

our State.

Now

Zod describes

the AI's response.

---

# Why use Zod twice?

This confused many beginners.

We actually have

two completely different problems.

---

## Problem 1

What should our Graph State look like?

Answer

```ts
StateSchema
```

using Zod.

---

## Problem 2

What should Gemini return?

Answer

```ts
responseFormat
```

using Zod.

Same library.

Different job.

---

# Visual Diagram

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

---

# Common Zod Methods

## String

```ts
z.string()
```

---

## Number

```ts
z.number()
```

---

## Boolean

```ts
z.boolean()
```

---

## Object

```ts
z.object({})
```

---

## Array

```ts
z.array()
```

---

## Enum

```ts
z.enum([])
```

---

## Default

```ts
.default()
```

---

## Min

```ts
z.number().min(0)
```

---

## Max

```ts
z.number().max(10)
```

---

# Example From Our Project

```ts
judge_recommendation:

z.object({

    solution_1_score:

    z.number()

    .min(0)

    .max(10),

    solution_2_score:

    z.number()

    .min(0)

    .max(10),

    winner:

    z.enum([

        "solution_1",

        "solution_2",

        "draw"

    ])

})
```

Now Gemini knows

exactly

what to return.

---

# Common Mistakes

## Thinking Zod replaces TypeScript

Wrong.

TypeScript checks code while developing.

Zod checks data while running.

You often use both together.

---

## Forgetting default()

Without

```ts
.default("")
```

your field may be

```ts
undefined
```

---

## Using string instead of enum

Wrong

```ts
winner:

z.string()
```

Better

```ts
winner:

z.enum([

"solution_1",

"solution_2",

"draw"

])
```

---

## Trusting AI blindly

Never assume AI returns perfect JSON.

Always validate it.

---

# Interview Questions

## What is Zod?

A runtime schema validation library for TypeScript.

---

## Why use Zod if we already have TypeScript?

TypeScript only checks types during development.

Zod validates data at runtime.

---

## Why do AI projects often use Zod?

Because AI responses are unpredictable.

Zod ensures the returned data follows the expected structure.

---

## Why did we use Zod in two places?

One describes the Graph State.

The other describes the AI response.

---

## What does `.default()` do?

It provides a value when one isn't supplied, preventing fields from being `undefined`.

---

# Summary

Zod is one of the most important libraries in modern TypeScript applications.

It validates data while your program is running.

In our project we use it to

- define our State
- validate AI responses

Without Zod,

AI could return unexpected data that breaks our application.

---

# Things I Should Remember

- Zod validates data at runtime.
- TypeScript validates code at compile time.
- Zod and TypeScript work together.
- `z.string()` defines a string.
- `z.number()` defines a number.
- `z.object()` creates objects.
- `z.array()` creates arrays.
- `z.enum()` restricts values to a fixed list.
- `.default()` provides initial values.
- We use Zod twice:
  - once for the LangGraph State
  - once for the AI's structured response.
- Think of Zod as a **security guard** that checks every piece of data before it's allowed into your application.