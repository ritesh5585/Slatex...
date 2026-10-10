# Slatex

Paste in a GitHub username or repo and get a dashboard back: commit activity, language breakdown, README rendered inline, developer comparison, that kind of thing. Built it because I kept opening five GitHub tabs just to get a feel for a profile or repo before actually reading the code.

**Live:** https://slatex-seven.vercel.app

Try `ritesh5585`, `vercel/next.js`, or just paste a full GitHub URL.

**Author:** Ritesh V ([@ritesh5585](https://github.com/ritesh5585))

## What it does

- Type a username → get a profile dashboard (avatar, bio, followers/following, public repos, top languages, recent repositories)
- Type `owner/repo` or paste a GitHub URL → get a repo breakdown (stars, forks, open issues, PRs, license, topics, contributors, recent commits, README)
- Contribution heatmap for the last 12 months, GitHub-graph style, with per-day tooltips
- Weekly commit activity chart with period filters (7D / 30D / 3M / 1Y)
- Language distribution as a stacked bar with a legend instead of GitHub's plain list
- Commits view: the repositories a user has actively pushed to, with a live filter
- Compare two developers side by side (followers, contributions, top repos, languages, monthly activity)
- README rendered directly in the page so you don't have to tab over

It also tries not to fall over when data is incomplete, which happens more than you'd think: empty repos have no languages, some users have no public repos, and commit stats can be missing or still loading. There's an explicit fallback or empty state for most of that instead of a blank screen or a stack trace. Route-level `loading.tsx` skeletons cover the loading side.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion and GSAP for the animations, Recharts for charts, and the **GitHub GraphQL API** for data. Deployed on Vercel.

GitHub calls happen on the server (services + route handlers), so the token never reaches the browser.

## How the data flows

```
Browser → page / route handler
        → service  (users, repos, commits, contributions, readme, compare)
        → githubGraphQL()  (single client: auth, error mapping)
        → GitHub GraphQL API
        → typed result → UI
```

- `queries/` holds the raw GraphQL documents, `services/` turns them into typed results, and `client.ts` is the only place that talks to GitHub.
- Errors are mapped to typed classes (`NotFoundError`, `RateLimitError`, `AuthError`, `NetworkError`) so route handlers can return the right HTTP status.

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
  api/github/
    user/[username]/                profile + contributions
    repo/[owner]/[name]/            repo + commits
    compare/                        two-user comparison

components/
  user/                             heatmap, language chart, repo grid, commit cards
  repo/                             stats, activity, timeline, contributors, sidebar
  compare/                          search bar, monthly chart
  landing/                          navbar, stats, CTA, modals
  ui/ shared/ icons/                primitives and shared states

lib/
  api/github/
    client.ts                       GraphQL client
    errors.ts                       typed errors
    queries/                        GraphQL documents
    services/                       data-fetching functions
    types.ts
  language-colors.ts                language → hex map
  utils.ts
```

## Things that were annoying to get right

- GitHub returns different failure modes (rate limit, bad token, missing user, network) that all need different UI and status codes, hence the typed error classes
- Doing the heatmap and language chart at 375px first and scaling up took a full redesign pass; they did not just "shrink nicely" from the desktop versions
- New repos with zero languages needed an explicit empty state instead of an empty chart rendering as a blank box
- Users with no public repos or no commit activity needed their own empty states

## Roadmap

- [ ] Response caching and per-user rate limiting
- [ ] GitHub OAuth (per-user quota, history, bookmarks)
- [ ] Open-source repo recommendations based on a user's languages and topics
- [ ] Repo digest: turn a repo into an LLM-friendly text prompt
- [ ] Auto-generated architecture diagram for a repo
- [ ] Export the dashboard as an image or PDF
- [ ] Light theme (currently dark-only)

## License

MIT