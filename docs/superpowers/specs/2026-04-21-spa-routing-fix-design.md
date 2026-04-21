# SPA Routing Fix — Vercel Catch-All Rewrite

**Date:** 2026-04-21
**Status:** Approved

## Problem

The docs site is a Vite + React SPA using `BrowserRouter`. Vite only emits `/index.html` as a build artifact. Without a server-side rewrite, any direct URL load (e.g. `/why-okp`, `/packages/schema`, `/paper`) returns a 404 on Vercel instead of serving the SPA shell.

## Solution

Add `docs/vercel.json` with a single catch-all rewrite rule:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Vercel applies this rule at the edge: every incoming path is served `/index.html`, and React Router handles the route client-side.

## Scope

- **1 file added:** `docs/vercel.json`
- **0 code changes** to App.tsx, vite.config.ts, or any component

## Success Criteria

- Direct load of `/why-okp`, `/packages/schema`, `/paper`, `/spec/v0` all resolve correctly
- Page refresh on any route does not 404
- Shared links work from outside the app
