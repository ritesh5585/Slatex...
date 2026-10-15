# Slatex

Paste in a GitHub username or repo and get a dashboard back: commit activity, language breakdown, README rendered inline, developer comparison, that kind of thing. Built it because I kept opening five GitHub tabs just to get a feel for a profile or repo before actually reading the code.

**Live:** https://slatex-seven.vercel.app

Try `ritesh5585`, `vercel/next.js`, or just paste a full GitHub URL.

**Author:** Ritesh V ([@ritesh5585](https://github.com/ritesh5585))

## What it does

- Type a username → get a profile dashboard (avatar, bio, followers/following, public repos, top languages, recent repositories)
- Type `owner/repo` or paste a GitHub URL → get a repo breakdown (stars, forks, open issues, PRs, license, topics, contributors, recent commits, README)
- Contribution heatmap for the last 12 months, GitHub-graph style, with per-day tooltips
- Language distribution as a stacked bar with a legend instead of GitHub's plain list
- Commits view: the repositories a user has actively pushed to, with a live filter
- Compare two developers side by side (followers, contributions, top repos, languages, monthly activity). Both profiles come back in a single GraphQL query, and the comparison page has a shareable URL
- README rendered directly in the page so you don't have to tab over
- Redis caching and per-IP rate limiting, so repeat visits are fast and one visitor can't use up the shared GitHub quota (see below)

It also tries not to fall over when data is incomplete, which happens more than you'd think: empty repos have no languages, some users have no public repos, and commit stats can be missing or still loading. There's an explicit fallback or empty state for most of that instead of a blank screen or a stack trace. Route-level `loading.tsx` skeletons cover the loading side.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion and GSAP for the animations, Recharts for charts, and the **GitHub GraphQL API** for data. Upstash Redis for caching and rate limiting. Deployed on Vercel.

GitHub calls happen on the server (services + route handlers), so the token never reaches the browser.

## How the data flows

```
Browser → page / route handler
        → service  (users, repos, commits, contributions, readme, compare)
        → cached(key, loader)
             ├─ HIT  → return from Redis, no GitHub call
             └─ MISS → enforceLimit() → githubGraphQL() → store in Redis
        → GitHub GraphQL API
        → typed result → UI
```

- `queries/` holds the raw GraphQL documents, `services/` turns them into typed results, and `client.ts` is the only place that talks to GitHub.
- Errors are mapped to typed classes (`NotFoundError`, `RateLimitError`, `AuthError`, `NetworkError`) so route handlers can return the right HTTP status.

## Caching and rate limiting

GitHub's GraphQL API gives one token 5,000 points per hour, shared by every visitor. Two things keep that from running out:

**Cache-aside with Upstash Redis.** Each service wraps its loader in `cached()`. Keys are versioned (`gh:v1:user:<name>`, `gh:v1:repo:<owner>/<repo>`, ...) so a response-shape change can be rolled out by bumping the version, and each resource has its own TTL. Hits and misses are logged as structured JSON, which is how I counted how many GitHub calls a page actually makes.

**Per-IP sliding-window rate limit.** `enforceLimit()` uses `@upstash/ratelimit` with a sliding window of 20 requests per hour per IP, under the `rl:gh-miss` prefix. It only runs on a cache **miss**, inside the loader, so a cached page costs no quota. Going over the limit throws a `ClientRateLimitError` with a retry-after value, and the UI renders a rate-limited state instead of an error page. Each consumed unit is logged with the loader name (`gh/user`, `gh/repo`, ...) and the IP.

If Upstash env vars are missing (plain local dev), the cache and limiter are skipped and requests go straight to GitHub.

**Measured, not guessed.** In dev logs, one full cold journey (profile → commits → repo → compare) currently costs 9 limiter units because each loader charges separately. Bundling the profile and repo loaders into single GraphQL queries is on the roadmap.

## Running it locally

```bash
git clone https://github.com/ritesh5585/slatex.git
cd slatex
npm install
npm run dev
```

Then go to `localhost:3000`.

The GraphQL API always requires authentication, so a token is required. Create `.env.local`:

```
GITHUB_TOKEN=ghp_xxxxxxxx

# Optional: enables caching + rate limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

A token with no extra scopes is enough for public data. Generate one at github.com/settings/tokens.

## How the input parsing works

One search box handles four shapes of input:

- `ritesh5585` → username
- `vercel/next.js` → owner/repo
- `https://github.com/facebook/react` → full repo URL
- `https://github.com/ritesh5585` → full profile URL

It strips protocol, query params, and trailing slashes, then decides whether it's looking at one segment (user) or two (repo) and routes accordingly. Everything downstream gets a clean `{ type, owner, repo? }` shape.

## Layout

```
app/
  page.tsx                          landing + search
  profiles/                         user dashboard (+ repos, commits tabs)
  repo/                             repo dashboard
  compare/                          shareable two-user comparison page
  api/github/
    user/[username]/                profile + contributions
    repo/[owner]/[name]/            repo + commits
    compare/                        two-user comparison

components/
  user/                             heatmap, language chart, repo grid, commit cards
  repo/                             stats, activity, timeline, contributors, sidebar
  compare/                          search bar, monthly chart
  landing/                          navbar, stats, CTA, modals
  ui/ shared/ icons/                primitives and shared states (incl. rate-limited)

lib/
  redis.ts                          Upstash client (null when env vars are missing)
  rate-limit.ts                     enforceLimit(): per-IP sliding window
  api/github/
    client.ts                       GraphQL client
    errors.ts                       typed errors
    queries/                        GraphQL documents
    services/                       data-fetching functions
    types.ts
  language-colors.ts                language → hex map
  utils.ts
```