# DSA Arena

A personal, single-user LeetCode-style practice app for the 150-question DSA interview sheet.

- **Problem list** with progress rings, topic chips, filters, search, and a LeetCode link for every question
- **Workspace**: description on the left, Monaco editor on the right, and a Testcase / Test Result console
- Run and submit code in **JavaScript (Node.js)** or **Python 3**. Both run in the browser (V8 Web Worker and Pyodide), so no execution server is needed
- **Answer** tab with the approach, complexity and reference solutions in both languages (revealing it marks the problem as *answer viewed*)
- **History** of your submissions; click one to load its code back
- **Marathon mode**: pick topics, difficulty, question count and a time limit, then solve against a countdown. Answers are locked, and results are saved to a history
- Progress, code and settings are stored in `localStorage`, with **Export / Import** backups on the dashboard
- Adjustable reading size (user menu → Text size) and editor font size (⚙ in the editor header)

## Setup

Requirements: Node.js 20+ and npm. Python 3 is only needed for `npm run validate` / `gen-expected`.

```bash
npm install
cp .env.example .env.local
npm run hash-password -- "choose-a-password"   # copy the printed AUTH_PASSWORD_HASH line
```

Fill in `.env.local`:

| Variable | What it is |
|---|---|
| `AUTH_USERNAME` | The username you sign in with |
| `AUTH_PASSWORD_HASH` | bcrypt hash from `npm run hash-password`. Keep each `$` escaped as `\$` (Next.js expands `$` in env files); the script prints the line already escaped |
| `AUTH_SECRET` | A random string of 32+ characters, used to sign the session cookie. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"` |

Then:

```bash
npm run dev       # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run hash-password -- "pw"` | Print a bcrypt hash for `.env.local` |
| `npm run validate` | Check every problem: schema, both reference solutions against stored outputs, and that the starter code fails cleanly. Exits non-zero on any failure. Pass slugs to check only some: `npm run validate -- two-sum` |
| `npm run gen-expected -- <slug…>` | Generate expected outputs by running the JS reference, confirmed by Python. `--missing` fills new problems, `--all` regenerates everything |
| `npm run gen-index` | Regenerate `src/data/problems/index.js` after adding or removing problem files |

## How it works

- **Auth**: `src/proxy.js` (Next.js 16's renamed middleware) checks a `jose`-signed JWT in the `arena_session` httpOnly cookie on every route except `/login`. `POST /api/auth/login` checks the bcrypt hash and waits 600 ms on a failed attempt.
- **Problems** live in `src/data/problems/<slug>.js` (description, examples, constraints, harness, tests, answer). Expected outputs are generated into `src/data/expected/<slug>.json`, so they always come from running the reference solutions. Large inputs are built with a seeded generator (`src/data/gen.js`), which keeps the files small.
- **Runner** (`src/lib/runner/`): `js-engine.js` and `py-prelude.js` hold the harness for each language. The same code runs in the browser workers and in the Node validator, so what passes `validate` behaves the same in the app. Special harnesses cover in-place problems, design classes, linked-list cycles and intersections, random-pointer and graph deep copies, LCA, serialize/deserialize and `isBadVersion`. Problems with several correct answers use custom validators (`validators.js`).
- **Limits**: Run gives each case 2 s; Submit gives all cases 3 s together. On a timeout the worker is killed and recreated. Python loads Pyodide from jsDelivr the first time (a few seconds), and it is cached after that.

## Deploying to Vercel

1. Push the project to GitHub and import it in Vercel.
2. In **Project Settings → Environment Variables**, add `AUTH_USERNAME`, `AUTH_PASSWORD_HASH` and `AUTH_SECRET`. In the Vercel dashboard, paste the hash **without** the `\` escapes.
3. Deploy. No database or code-execution server is needed.
