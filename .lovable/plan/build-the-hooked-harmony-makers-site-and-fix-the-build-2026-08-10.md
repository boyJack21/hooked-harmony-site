# Build the Hooked Harmony makers site (and fix the build)

## Problem
The project currently has no application code at all — no `package.json`, no build command, no source files. That's why:
- The build fails: `no command found for task "build:dev"`.
- GitHub shows only the README: the repo has nothing else meaningful in it.

## Goal
Stand up a complete, working React + TypeScript + Vite + Tailwind app for **Hooked Harmony**, a crochet/knitting (hooked) craft & makers site. Once the app code exists in the project, it will flow into the git repo and up to GitHub on the next sync, so GitHub stops showing only the README.

## What we'll build — MVP pages

- **Home** — warm hero, value props, featured patterns, "meet the makers" strip, newsletter signup, footer.
- **Patterns** — browse crochet/knitting patterns as cards (category, difficulty, yardage, image), filterable.
- **Pattern detail** — materials, gauge, steps overview, download/save CTA.
- **Tutorials** — how-to articles/step guides for techniques.
- **Makers** — community directory of makers (name, location, specialty, links).
- **Contact** — form (email) + about blurb.

## Design direction
A distinctive, cozy craft aesthetic — not generic AI gradients. Warm terracotta/cream/sage/dusty-rose palette, soft yarn-like texture touches, a warm serif display font paired with a humanist sans for body. Semantic color tokens via the project's global CSS so dark mode and theming keep working. Mobile-responsive throughout.

## Data
Use the already-connected Supabase project (`.env` has `VITE_SUPABASE_*`). Add tables with seed data and correct RLS/grants so pages can read them:
- `patterns` — title, category, difficulty, yardage, image, description, is_featured.
- `tutorials` — title, technique, content, level.
- `makers` — name, location, specialty, bio, website.
- `newsletter` — email signups (insert only).
Public read on content; auth write only for newsletter if we add auth later.

## Tech / setup steps (technical details)
1. **Fix the build first.** Create the missing scaffold and add the `build:dev` lifecycle script:
   - Add `package.json` with the Lovable React/Vite/Tailwind/TS stack, a `build:dev` script, and the `[run] build:dev = ...` mapping in `lovable.toml` (or a `.lovable/` lifecycle script).
   - Add `vite.config.ts`, `tsconfig.json`, `tailwind.config`, `postcss.config`, `index.html`, `src/main.tsx`, `src/App.tsx`, global CSS with the design tokens, and a router.
   - Restore the existing Supabase client wiring in `src/integrations/supabase/`.
2. **Build the components/pages** described above, following standard Lovable conventions (small focused components, shadcn-style primitives, semantic tokens only — no hardcoded colors).
3. **Supabase schema** via a migration: tables + `GRANT`s (per public-schema rules) + RLS policies + seed rows.
4. **Verify** the build passes and the app renders (check build output + preview), then the files are in the repo for GitHub sync.

## Out of scope for this pass
- Authentication/login.
- Payments or a shop cart (adding an actual storefront can come later if wanted).
- Custom email sending (newsletter is stored in the DB for now).

## Note on GitHub
Building the app code is the fix that matters here. Pushing it to GitHub is handled by the existing GitHub connection/sync once the code is committed to the repo; if GitHub still shows only the README after that, the sync may need a reconnect from the Lovable UI (Plus menu → GitHub).
