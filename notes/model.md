# 06 - Models in LangChain

# What is an AI Model?

An AI Model is a program that has been trained on a huge amount of data to understand and generate human language.

Think of it as the **brain**.

Examples:

- Gemini
- Mistral
- Cohere
- GPT-4
- Claude

These models can:

- Answer questions
- Write code
- Summarize text
- Translate languages
- Explain concepts

In our AI Battle Arena,

the models are responsible for generating solutions.

---

# Why do we need Models?

Imagine our application.

The user asks:

```
What is React?
```

Without an AI model,

our application has no intelligence.

```
User

↓

Backend

↓

❌ No Answer
```

With an AI model,

```
User

↓

Backend

↓

Gemini

↓

Answer
```

The AI model is where the intelligence comes from.

---

# Mental Model

Imagine a teacher.

```
Student

↓

Teacher

↓

Answer
```

The student asks a question.

The teacher thinks.

The teacher responds.

The AI model is the teacher.

---

# Model vs AI Provider

This is something beginners often confuse.

There are two things.

## AI Provider

The company.

Examples:

- Google
- OpenAI
- Anthropic
- Mistral AI
- Cohere

---

## AI Model

The actual model created by that company.

Examples

Google →

- Gemini 2.5 Flash

OpenAI →

- GPT-4.1

Anthropic →

- Claude Sonnet

Mistral →

- Mistral Large

Think

```
Google

↓

Gemini

OpenAI

↓

GPT
```

The provider owns the model.

---

# Creating a Model

Example

```ts
const geminiModel = new ChatGoogleGenerativeAI({

    apiKey: process.env.GEMINI_API_KEY,

    model: "gemini-2.5-flash"

});
```

Breaking it down

```ts
ChatGoogleGenerativeAI
```

This is LangChain's wrapper around Google's Gemini API.

---

```ts
apiKey
```

Allows your application to authenticate with Google.

Without an API key,

Google won't let you use Gemini.

---

```ts
model
```

Tells Google which Gemini model to use.

---

# What is invoke()?

This is the most important method you'll use.

```ts
const response = await model.invoke(question);
```

Read it like English.

```
Model,

please process this input

and return an answer.
```

The word **invoke**

simply means

> "Execute" or "Run."

---

# Why don't we call the API ourselves?

Without LangChain,

you would need to

- Make HTTP requests
- Add headers
- Add API keys
- Parse JSON
- Handle errors

Lots of boilerplate.

With LangChain

```ts
await model.invoke(question);
```

One line.

LangChain handles everything.

---

# What can invoke() accept?

Usually

```ts
string
```

Example

```ts
await model.invoke("Explain React");
```

It can also accept

```ts
HumanMessage
```

Example

```ts
await model.invoke([

    new HumanMessage("Hello")

]);
```

Depending on the model,

there are several supported input formats.

---

# What does invoke() return?

Many beginners think

```ts
invoke()

↓

string
```

Not exactly.

It returns an

```
AIMessage
```

Example

```ts
const response = await model.invoke(question);
```

Response

```ts
AIMessage {

    content:"React is..."

}
```

Some providers also expose

```ts
response.text
```

or

```ts
response.content
```

depending on the integration you're using.

In our project we used

```ts
response.text
```

---

# Our Project

We have

```ts
const [

    mistralResponse,

    cohereResponse

] = await Promise.all([

    mistralModel.invoke(question),

    cohereModel.invoke(question)

]);
```

Notice

Both models receive

the same question.

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

---

# Why Promise.all()?

Without it

```ts
const answer1 =

await mistralModel.invoke(question);

const answer2 =

await cohereModel.invoke(question);
```

Execution

```
Mistral finishes

↓

Then Cohere starts
```

Total time

```
3s + 3s = 6s
```

---

With

```ts
Promise.all()
```

Both start together.

```
Mistral

↓

Answer


Cohere

↓

Answer
```

Total time

```
3 seconds
```

instead of

```
6 seconds
```

This makes our application much faster.

---

# Storing the Responses

After both models finish

we return

```ts
return{

    solution_1:mistralResponse.text,

    solution_2:cohereResponse.text

}
```

LangGraph automatically updates the State.

State becomes

```ts
{

    solution_1:"...",

    solution_2:"..."

}
```

Now the Judge Node can use them.

---

# Model Flow in Our Project

```
User

↓

Question

↓

Solution Node

↓

Mistral.invoke()

↓

Response


Question

↓

Solution Node

↓

Cohere.invoke()

↓

Response


↓

Return

↓

State Updated
```

---

# Common Mistakes

## Thinking invoke() returns a string

Not always.

Usually

it returns an AIMessage object.

You often access

```ts
response.text

or

response.content
```

depending on the provider.

---

## Forgetting await

Wrong

```ts
const response =

model.invoke(question);
```

Correct

```ts
const response =

await model.invoke(question);
```

---

## Calling models one after another

Wrong

```ts
await model1.invoke();

await model2.invoke();
```

Better

```ts
Promise.all([
    ...
]);
```

---

## Forgetting API Keys

Without an API key,

the model cannot authenticate.

---

# Interview Questions

## What is an AI Model?

An AI model is a trained machine learning model capable of understanding and generating human language.

---

## What is invoke()?

`invoke()` sends input to the model and returns its response.

---

## Why use LangChain models instead of calling APIs directly?

LangChain abstracts away HTTP requests, authentication, parsing, and provider differences behind a simple API.

---

## Why use Promise.all()?

To execute multiple asynchronous model requests in parallel, reducing total execution time.

---

## What does invoke() usually return?

An `AIMessage` object (or a provider-specific response wrapper), not just a plain string.

---

# Summary

Models are the brains of our AI application.

They generate answers.

LangChain gives every model a common method:

```ts
invoke()
```

This means we can switch between Gemini, Mistral, Cohere, or GPT without changing much of our code.

In our AI Battle Arena,

we ask two different models the same question,

collect both responses,

store them in the State,

and later let the Judge compare them.

---

# Things I Should Remember

- AI Providers create AI Models.
- Models generate responses.
- LangChain wraps different providers behind a common interface.
- `invoke()` means "run the model."
- `invoke()` is asynchronous.
- Always use `await`.
- `Promise.all()` runs multiple models simultaneously.
- Model responses are stored in the LangGraph State.
- The Judge Node reads those stored responses later.
- Think of a Model as the **brain**, and `invoke()` as asking the brain a question.