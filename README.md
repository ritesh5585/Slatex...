# Slatex

Paste in a GitHub username or repo and get a dashboard back — commit activity, language breakdown, README rendered inline, that kind of thing. Built it because I kept opening five GitHub tabs just to get a feel for a repo before actually reading the code.

Live: https://slatex-seven.vercel.app

Try `torvalds`, `vercel/next.js`, or just paste a full GitHub URL.

## What it does

- Type a username → get a profile dashboard (avatar, bio, stats, top languages, pinned repos)
- Type `owner/repo` or paste a GitHub URL → get a repo breakdown (stars, forks, license, topics, last commit)
- Commit activity heatmap for the last 26 weeks, GitHub-contribution-graph style, with per-day tooltips
- Language distribution as a stacked bar instead of GitHub's list
- README rendered directly in the page so you don't have to tab over

It also tries not to fall over when the data is incomplete, which happens more than you'd think — GitHub's `stats/commit_activity` endpoint is often just... still computing when you hit it, empty repos have no languages, some users have no public repos at all. There's a fallback state for most of that instead of a blank screen or a stack trace.

## Stack

Next.js 15 (App Router), TypeScript, Tailwind, Framer Motion for the small animations, GitHub's REST API for data. Deployed on Vercel.

Everything is a Server Component — the GitHub calls happen server-side and get streamed down, so there's no client-side waterfall and no token sitting in the browser.

## Running it locally

```bash
git clone https://github.com/your-username/slatex.git
cd slatex
npm install
npm run dev
```

Then go to `localhost:3000`.

It works with no auth, but GitHub caps unauthenticated requests at 60/hour, and you'll hit that fast if you're testing repeatedly. Drop a token in `.env.local` to get 5,000/hour instead:

```
GITHUB_TOKEN=ghp_xxxxxxxx
```

Read-only scope is fine. Generate one at github.com/settings/tokens.

## How the input parsing works

One search box handles four different shapes of input:

- `torvalds` → username
- `vercel/next.js` → owner/repo
- `https://github.com/facebook/react` → full repo URL
- `https://github.com/torvalds` → full profile URL

It strips protocol, query params, and trailing slashes, then figures out whether it's looking at one segment (user) or two (repo) and routes accordingly. All of that logic lives in `lib/parse-input.ts` — everything downstream just gets a clean `{ type, owner, repo? }` shape to work with.

## Layout

```
app/
  page.tsx                  landing + search
  u/[username]/page.tsx     user dashboard
  r/[owner]/[repo]/page.tsx repo page

components/
  commit-activity.tsx       heatmap
  language-chart.tsx        stacked bar + legend
  readme-preview.tsx        markdown renderer
  repo-stats.tsx
  user-profile.tsx

lib/
  github.ts                 GitHub API client
  language-colors.ts        language -> hex map
  parse-input.ts            input normalization
```

## Things that were annoying to get right

- GitHub's commit activity endpoint sometimes returns a 202 while it computes stats in the background — you have to handle that as a distinct state, not an error
- The `days` array in commit stats isn't always fully populated, so I pad it rather than trust it
- Doing the heatmap and language chart at 375px first and scaling up took a full redesign pass — they did not just "shrink nicely" from the desktop versions
- New repos with zero languages needed an explicit empty state instead of an empty chart rendering as a weird blank box

## Not done yet

- Side-by-side comparison of two users
- Combined contribution calendar across all of someone's repos, not just one
- Export the dashboard as an image or PDF
- Light theme (currently dark-only)
- OAuth so private repos work too

## License

MIT