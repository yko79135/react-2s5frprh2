# Practice Test App (Next.js + Prisma + SQLite)

A simple practice test platform for teachers and students.

## Features
- Teacher login with env password.
- Create tests by pasting structured JSON.
- Test code + shareable `/take/[code]` link.
- Student nickname join flow (no password).
- One-question-at-a-time test UI with autosave (local + server).
- Deterministic auto-grading for multiple choice and short answer.
- Essay grading using OpenAI API and strict rubric JSON output.
- Essay safeguards: length limit, truncation warning, rate limit (3 calls/min/test), low temp.
- Teacher dashboard, per-attempt review, CSV export, essay regrade endpoint.
- Seeded demo test (`BIO101`).
- Unit tests for deterministic grading.

## Tech Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Prisma + SQLite
- OpenAI SDK
- Vitest

## Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required:
- `DATABASE_URL="file:./dev.db"`
- `TEACHER_PASSWORD="your-password"`
- `TEACHER_SESSION_SECRET="long-random-string"`
- `OPENAI_API_KEY="sk-..."` (optional but needed for essay auto-grading)
- `NEXT_PUBLIC_BASE_URL="http://localhost:3000"`

## Local Development
1. Install deps:
   ```bash
   npm install
   ```
2. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Test JSON Format
Paste JSON with this shape in teacher create form:

```json
{
  "title": "Biology Practice Test - Chapter 3",
  "timeLimitMinutes": 40,
  "questions": [
    {
      "id": "q1",
      "type": "multiple_choice",
      "prompt": "Which statement is true about ...?",
      "choices": ["A ...", "B ...", "C ...", "D ..."],
      "answer": "B",
      "points": 1,
      "explanation": "Why B is correct..."
    }
  ]
}
```

## Routes
- `/teacher/login`
- `/teacher/tests`
- `/teacher/tests/[id]`
- `/teacher/attempts/[attemptId]`
- `/take/[code]`
- `/take/[code]/question/[n]`
- `/take/[code]/review`
- `/results/[attemptId]`

## Unit Tests
```bash
npm run test
```
