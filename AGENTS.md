# Construxa – Global Agent Instructions

You are contributing to **Construxa**, an AI-powered CAD analysis platform for construction.
The stack is: Next.js (App Router), TypeScript, Tailwind, Supabase, OpenAI, Razorpay.

## General goals

- Preserve the existing architecture and file structure.
- Prefer small, focused pull requests that are easy to review.
- Keep security in mind: do not expose secrets, trust only authenticated Supabase users, and validate all input.

## Coding conventions

- Use TypeScript strictly, no `any` unless absolutely necessary.
- Follow existing patterns in `app/`, `components/`, `hooks/` and `lib/`.
- Reuse existing UI primitives in `components/ui` and the existing dashboard components.
- Keep server-only logic in API routes or server actions; never ship secrets to the client.

## Testing & quality

- Whenever you add or change backend behavior, also add or update tests if a test setup exists.
- Run `npm run lint` and any relevant tests before you consider the task complete.
- Update or create documentation in `README.md` or `docs/` if behavior changes in user‑visible ways.

## Git / PR behavior

- Group related changes in a single commit.
- Use descriptive commit messages, e.g. `feat(boq): add excel export for project BOQ`.
- Avoid refactors unrelated to the current task unless explicitly requested.
