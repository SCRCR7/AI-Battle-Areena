# Git Push Rejected (non-fast-forward) Explained

# What happened?

I wrote some code.

Then I tried to push.

```bash
git push origin main
```

But Git said

```bash
! [rejected] main -> main (non-fast-forward)
```

or

```bash
Updates were rejected because the remote contains work that you do not have locally.
```

At first, this looks scary 😅.

But it's actually Git trying to **protect your code**.

---

# Think Like WhatsApp

Imagine you and your friend are editing the same document.

Current document

```
Hello World
```

Your friend changes it to

```
Hello World!
```

At the same time, you change it to

```
Hello World 😊
```

Now there are **two different versions**.

Git asks:

> "Which version should I keep?"

Instead of guessing, Git stops and asks you to synchronize first.

---

# Mental Model

```
Your Computer
        │
        │ Push
        ▼
GitHub Repository
```

Git will only allow a push if your local branch is **ahead** of GitHub.

If GitHub has new commits that you don't have, Git stops the push.

---

# First Push (Easy)

Suppose you created a project.

```
hello.js
```

```js
console.log("Hello World");
```

Commands

```bash
git init

git add .

git commit -m "Initial commit"

git push origin main
```

Everything works ✅

---

# Second Push (Normal Workflow)

Now you create another file.

```
app.js
```

```js
console.log("App Started");
```

Commands

```bash
git add .

git commit -m "Added app.js"

git push origin main
```

If **nobody changed GitHub**, the push succeeds.

This is the normal workflow you'll use most of the time.

---

# Why Did My Push Fail?

Suppose after your first push,

someone (or even you) edited the README directly on GitHub.

GitHub now has

```
README Updated
```

Your computer **doesn't know** about this change.

Now you create

```
notes.md
```

and run

```bash
git add .

git commit -m "Added notes"

git push origin main
```

Git says

```
❌ Stop!

GitHub has commits you don't have.
```

Why?

Because if Git accepted your push,

it might overwrite someone else's work.

Git protects both versions.

---

# Solution

First, download the latest changes.

```bash
git pull --rebase origin main
```

Then push again.

```bash
git push origin main
```

---

# What does git pull do?

Think of GitHub as your class teacher.

Teacher has

```
Version 2
```

You still have

```
Version 1
```

Running

```bash
git pull
```

means

> "Teacher, give me the latest copy."

Now both are synchronized.

---

# What does --rebase mean?

Without rebase

History becomes

```
A

↓

B

↓

Merge Commit

↓

C
```

Git creates an extra merge commit.

History becomes messy.

---

With rebase

Git temporarily removes your commits,

downloads GitHub's commits,

then places your commits on top.

History

```
A

↓

B

↓

C
```

Cleaner.

---

# Easy Example

GitHub

```
Commit 1

↓

Commit 2
```

Your Computer

```
Commit 1

↓

Commit 3
```

Run

```bash
git pull --rebase
```

Git does

```
Take away Commit 3

↓

Download Commit 2

↓

Add Commit 3 again
```

Final history

```
Commit 1

↓

Commit 2

↓

Commit 3
```

Very clean.

---

# Urdu Explanation

Suppose GitHub ek shop hai.

Aur aapke computer mein us shop ki copy pari hui hai.

Aap computer mein kaam karte rahe.

Lekin kisi ne GitHub par bhi changes kar diye.

Ab

GitHub

```
Version 2
```

Aur

Computer

```
Version 1
```

Ho gaya.

Agar aap seedha push karenge,

Git kahega

> "Pehle latest changes le kar aao."

Isliye

```bash
git pull --rebase origin main
```

karte hain.

Phir

```bash
git push
```

---

# Everyday Workflow

Every time you start coding

(Optional but recommended)

```bash
git pull --rebase origin main
```

After coding

```bash
git add .

git commit -m "Your message"

git push origin main
```

Simple.

---

# Safe Workflow (Recommended)

```bash
git pull --rebase origin main

git add .

git commit -m "Added new feature"

git push origin main
```

This reduces the chance of conflicts.

---

# When should I use git pull --rebase?

✅ Before starting work (especially on shared repositories)

✅ If push gets rejected

✅ When GitHub has newer commits

---

# When should I NOT use git push --force?

Avoid using

```bash
git push --force
```

unless you **know exactly** what you're doing.

Why?

Because it tells Git

> "Ignore everyone else's work and replace GitHub with my version."

It can accidentally delete commits from the remote repository.

---

# Common Mistakes

❌ Forgetting to commit before pushing

Wrong

```bash
git push
```

Correct

```bash
git add .

git commit -m "Added feature"

git push
```

---

❌ Editing files directly on GitHub and forgetting to pull

Always run

```bash
git pull --rebase
```

before pushing if the remote has changed.

---

❌ Using `git push --force` for every problem

Don't.

Only use it when you intentionally want to overwrite the remote history.

---

# Commands I Should Remember

Check status

```bash
git status
```

Download latest changes

```bash
git pull --rebase origin main
```

Stage files

```bash
git add .
```

Commit

```bash
git commit -m "message"
```

Push

```bash
git push origin main
```

---

# Summary

Git is not rejecting your push because something is wrong.

Git is protecting your work and the work already on GitHub.

If GitHub has newer commits:

1. Pull the latest changes.

```bash
git pull --rebase origin main
```

2. Then push your commits.

```bash
git push origin main
```

Think of `git pull --rebase` as saying:

> "First, let me bring my notebook up to date. Then I'll add my new work on top of it."