# Krish — EEE Portfolio Website

A static portfolio and engineering showcase designed with an editorial, high-contrast, "not AI-looking" aesthetic. Built with [Astro](https://astro.build) and Markdown content collections.

## Aesthetic & Design Rules
- **Color Palette**: Warm off-white background (`#FAFAF8`), high-contrast near-black text (`#181816`), deep muted teal accent (`#1B3C48`), and subtle 1px dividers (`#E5E5DE`). Optional muted charcoal dark theme.
- **Typography**: Newsreader (editorial serif) for headings and Inter (clean sans-serif) for body copy.
- **Layout**: Single reading column (~740px max-width), left-aligned, ample negative space.
- **Tone**: Engineering-first framing emphasizing systems architecture, problem solving, hardware schematics, and performance metrics.

---

## Sitemap & Structure
- **Home** (`/`): Name, one-line identity ("EEE undergraduate building automation and embedded projects"), 3 featured projects, and direct links to GitHub, LinkedIn, and email.
- **About** (`/about`): Narrative overview, EEE degree coursework, and plain skills inventory grouped by Languages, Hardware, and Tools (no percentage bars).
- **Projects Index** (`/projects`): Clean filterable table with category tabs (`All`, `Software`, `Automation`, `AI`, `Hardware`).
- **Individual Project Pages** (`/projects/[slug]`):
  - `shop-cold-outreach` — Distributed business lead aggregation and rate-governed notification dispatch pipeline.
  - `bluelink-ai` — Telematics telemetry analyzer and automotive diagnostic reasoning engine.
  - `recall` — Contextual semantic search engine and local knowledge retrieval system.
  - `humanesque-typer` — Windows low-level input simulation engine with stochastic keystroke timing distributions.
  - `lineup-webpage` — Interactive event roster coordinator and conflict-free schedule grid allocation interface.
  - `krish-c-projects` — Systems programming suite (custom free-list heap allocator, Robin Hood hash table, POSIX utilities).
  - `iot-power-monitor` — Microcontroller IoT AC/DC True-RMS power telemetry node (ESP32, FreeRTOS, KiCad, ACS712).
- **Achievements** (`/achievements`): Reverse-chronological timeline of hackathons, circuit debugging competitions, and academic honors driven by `src/data/achievements.ts`.
- **Resume** (`/resume`): Downloadable PDF link (`/resume.pdf`) + short inline summary of education, technical competencies, projects, and honors.
- **Contact** (`/contact`): Direct email, LinkedIn, and GitHub links with a quick one-click copy button.

---

## How to Add New Content

### 1. Adding a Project
Create a new `.md` file inside `src/content/projects/<slug>.md`:
```markdown
---
title: "Project Name"
description: "One-line technical summary."
category: "Software" # Software | Automation | AI | Hardware
year: "2026"
tags: ["C++", "FreeRTOS", "I2C"]
featured: false # Set true to display on home page
github: "https://github.com/krish/repo-name"
demo: "https://demo.dev" # optional
order: 8
---

## Problem
Describe the core technical constraint.

## What Was Built
Detail the architecture and implementation.

## Tech Used
- Bullet points of libraries, tools, protocols.

## Key Decisions & Engineering Challenges
- Specific trade-offs, algorithms, or hurdles solved.
```

### 2. Adding an Achievement or Hackathon
Open `src/data/achievements.ts` and append a new object to the `achievements` array:
```typescript
{
  event: "Hackathon Name",
  result: "1st Place Winner",
  date: "Nov 2026",
  description: "One-line summary of what you built and the problem statement solved.",
  link: "https://certificate-url.com", // optional
  category: "Hackathon"
}
```

---

## Development & Build Commands

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm run dev

# Run Astro & TypeScript type check
pnpm exec astro check

# Build production static bundle (outputs to ./dist)
pnpm run build

# Preview static build locally
pnpm run preview
```

## Deployment
- **GitHub Pages**: Preconfigured GitHub Actions workflow in `.github/workflows/deploy.yml`. Automatically deploys to GitHub Pages on every push to `main`.
- **Netlify**: Preconfigured `netlify.toml`. Connect the repo to Netlify for automatic continuous deployment.
