# SPA Routing Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `vercel.json` catch-all rewrite so direct URL loads, refreshes, and shared links work correctly on Vercel for this Vite + React SPA.

**Architecture:** Vercel reads `vercel.json` at deploy time. A single rewrite rule maps all paths to `/index.html`, letting React Router handle routing client-side. No application code changes required.

**Tech Stack:** Vercel, Vite, React Router v6

---

### Task 1: Add vercel.json

**Files:**
- Create: `docs/vercel.json`

- [ ] **Step 1: Create `docs/vercel.json`**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 2: Verify dev server still works**

Run: `npm run dev` from `docs/`
Expected: Server starts at `http://localhost:4321`, no errors

- [ ] **Step 3: Verify build succeeds**

Run: `npm run build` from `docs/`
Expected: `dist/` emitted with no TypeScript or Vite errors

- [ ] **Step 4: Verify preview serves all routes correctly**

Run: `npm run preview` from `docs/`
Open in browser: `http://localhost:4173/why-okp`, `http://localhost:4173/paper`, `http://localhost:4173/packages/schema`
Expected: All routes render without 404 (note: `vite preview` does not apply `vercel.json` rewrites — the presence of the file is what matters for Vercel deploy; local preview using the SPA shell confirms the routes work once the shell loads)

- [ ] **Step 5: Commit**

```bash
git add docs/vercel.json
git commit -m "fix(docs): add vercel.json SPA catch-all rewrite for client-side routing"
```
