# Greenhouse Log — Plant Care Assistant

A small client-side web app for tracking houseplants: a plant library, watering
reminders, and a care journal. No backend, no build step — plain HTML, CSS,
and JavaScript, with data kept in the browser's `localStorage`.

## Running it locally

No install required. From the project folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Opening `index.html` directly by
double-clicking also works, since there's no build step.)

## Project structure

```
plant-care-assistant/
├── index.html          # page shell, all four views
├── css/
│   └── style.css
├── js/
│   ├── data.js          # seed data for a first run
│   ├── store.js         # localStorage read/write, shared by every feature
│   ├── library.js        Feature 1 — Plant Library
│   ├── reminders.js       Feature 2 — Watering Reminders
│   ├── journal.js         Feature 3 — Care Journal
│   └── app.js            navigation + dashboard, wires the features together
├── Jenkinsfile
└── .gitignore
```

Each feature file only touches its own section of the page (its own `view__`
elements) and reads/writes through `store.js`. That split is intentional —
see the collaboration plan below.

---

## Setting this up as a team project on GitHub

This is written for the workflow described in the brief: one owner account,
three collaborators, feature branches, pull requests, and a Jenkins pipeline.

### 1. Owner: create the repo and invite collaborators

1. Create a new **private** (or public) repo on GitHub, e.g. `greenhouse-log`.
2. Push this project as the initial commit on `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial scaffold: dashboard, library, reminders, journal"
   git branch -M main
   git remote add origin https://github.com/<owner>/greenhouse-log.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Collaborators → Add people**, and invite the three
   team members. They accept the invite by email or from their GitHub
   notifications.
4. Optional but recommended: **Settings → Branches → Add branch protection
   rule** for `main` — require a pull request before merging, and require
   status checks (the Jenkins build) to pass.

### 2. Each collaborator: work on a feature branch

A natural split, matching the file layout above, so three people can work
without stepping on each other's files:

| Member | Branch | Owns |
|---|---|---|
| A | `feature/plant-library` | `js/library.js`, plant cards in `style.css` |
| B | `feature/watering-reminders` | `js/reminders.js`, reminder rows in `style.css` |
| C | `feature/care-journal` | `js/journal.js`, journal entries in `style.css` |

Each person, after accepting the invite:

```bash
git clone https://github.com/<owner>/greenhouse-log.git
cd greenhouse-log
git checkout -b feature/plant-library     # use your own branch name
# ...make changes...
git add .
git commit -m "Add plant photo field to library cards"
git push -u origin feature/plant-library
```

### 3. Open a pull request

On GitHub, open a PR from `feature/plant-library` into `main`. Add a short
description of what changed and why. If branch protection is on, the Jenkins
check below has to pass before the PR can merge. Ask at least one other
member to review before merging.

### 4. Jenkins CI

A starter `Jenkinsfile` is included at the project root. It:

1. Checks out the branch under test.
2. Installs `htmlhint` and `eslint` and lints the HTML/JS.
3. Confirms the site actually boots by starting a static file server and
   requesting `index.html`.

To wire it up:

1. In Jenkins, create a new **Pipeline** job (or a **Multibranch Pipeline**
   if you want Jenkins to build every branch and PR automatically).
2. Point it at the GitHub repo and set it to use the `Jenkinsfile` in the
   repo root.
3. In the GitHub repo, add a webhook to your Jenkins server
   (**Settings → Webhooks**) so pushes and PRs trigger a build, or install
   the GitHub Branch Source plugin on the Jenkins side and let it discover
   branches automatically.
4. Once builds are running, add the Jenkins check as a required status check
   under the `main` branch protection rule, so PRs can't merge on a failing
   build.

### 5. Suggested day-to-day flow

1. Pull the latest `main` before starting new work.
2. Branch, commit in small logical chunks, push.
3. Open a PR early (even as a draft) so the others can see what's in
   progress and avoid duplicate work.
4. Jenkins runs automatically on the PR.
5. Once approved and green, merge (squash merge keeps `main`'s history
   readable), then delete the feature branch.

---

## Ideas for further features

- Photo upload per plant (stored as a data URL in `localStorage`, or moved
  to a real backend later).
- Export/import the plant list as JSON.
- A "propagation log" tied to a parent plant.
- Push notifications for overdue watering (would need a service worker and
  a small backend — a good stretch goal once the team is comfortable with
  the PR workflow).
