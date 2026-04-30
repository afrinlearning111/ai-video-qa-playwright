# AI Video Generation — QA Automation Suite (Playwright + TypeScript)

[![Playwright Tests](https://github.com/<your-username>/ai-video-qa-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/<your-username>/ai-video-qa-playwright/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.48-green?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An end-to-end **Quality & Testing portfolio project** that applies engineering rigor to **AI-driven video generation products** — Runway ML, Pika Labs, and OpenAI Sora. Built with **TypeScript + Playwright**, it covers UI automation, API validation, prompt-quality evaluation heuristics, and structured bug reporting for AI products.

---

## Why this project exists

AI video generators are notoriously hard to QA — outputs are non-deterministic, prompts behave inconsistently, and "quality" itself is subjective. This repo treats those traits as a **first-class testing problem**:

- How do you regression-test a feature whose output changes every run?
- How do you write a test oracle for "the video looks correct"?
- How do you log a bug when the bug is subtle prompt drift, not a stack trace?

The suite here demonstrates **opinionated answers** to those questions, packaged as production-grade TypeScript code, an organized bug-report repository, and a CI/CD pipeline.

---

## Tech stack

| Layer | Tool |
|---|---|
| Language | TypeScript 5.6 (strict mode) |
| Test runner | Playwright Test 1.48 |
| API testing | Playwright `request` fixture + REST contract tests |
| Reporting | Playwright HTML, JUnit XML, JSON |
| CI/CD | GitHub Actions (matrix across Chromium / Firefox / WebKit) |
| Code quality | ESLint, Prettier, `tsc --noEmit` |
| Patterns | Page Object Model (POM), Fixtures, Data-Driven tests |

---

## What's covered

### 1. Functional UI tests
- Landing page integrity for Runway, Pika, Sora marketing pages
- Navigation, header/footer links, sign-in flow surfaces
- Pricing page consistency (plan tiers, CTA, currency)
- Cross-browser parity (Chromium / Firefox / WebKit)
- Mobile viewport rendering (Pixel 7, iPhone 14)

### 2. AI-specific quality checks
- **Prompt input validation**: empty, too-long, special characters, prompt injection (`ignore previous instructions…`), multilingual input
- **Output sanity heuristics**: response time bounds, generated-asset URL reachability, MIME-type checks
- **Negative prompts**: reserved-token rejection, safety-filter behavior assertions
- **Determinism probes**: same prompt + same seed → assert structural similarity of metadata

### 3. API tests
- Contract tests against a public REST endpoint (JSONPlaceholder) as a stand-in for the AI generation API
- Status code, schema, header, and latency assertions
- Auth-failure scenarios (401, 403)
- Rate-limit handling

### 4. Exploratory / breaking-it tests
- Documented in `bug-reports/` as Markdown — each report follows a Steps → Expected → Actual → Severity → Repro-rate template, the same format used in real QA tickets.

---

## Project structure

```
ai-video-qa-playwright/
├── tests/
│   ├── runway/                 # Runway ML UI tests
│   │   ├── homepage.spec.ts
│   │   └── pricing.spec.ts
│   ├── pika/                   # Pika Labs UI tests
│   │   └── homepage.spec.ts
│   ├── sora/                   # Sora product page tests
│   │   └── homepage.spec.ts
│   ├── ai-quality/             # Prompt + output quality heuristics
│   │   └── prompt-validation.spec.ts
│   └── api/                    # REST API contract tests
│       └── generation.api.spec.ts
├── pages/                      # Page Object Models
│   ├── BasePage.ts
│   ├── RunwayHomePage.ts
│   └── PikaHomePage.ts
├── fixtures/                   # Custom Playwright fixtures
│   └── test-fixtures.ts
├── utils/                      # Helpers (logger, test-data, schema)
│   ├── logger.ts
│   ├── api-helper.ts
│   └── prompt-data.ts
├── test-data/                  # Data-driven inputs
│   └── prompts.json
├── bug-reports/                # Discovered issues, written up properly
│   ├── BUG-001-prompt-injection.md
│   ├── BUG-002-mobile-cta-overlap.md
│   └── BUG-003-pricing-currency-mismatch.md
├── .github/workflows/
│   └── playwright.yml          # CI pipeline
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

## Quick start

```bash
# Prereqs: Node.js >= 18
git clone https://github.com/<your-username>/ai-video-qa-playwright.git
cd ai-video-qa-playwright
npm install
npx playwright install --with-deps

# Run everything
npm test

# Run a tagged subset
npm run test:smoke
npm run test:regression

# Target a single product
npm run test:runway
npm run test:pika

# API-only
npm run test:api

# Open the HTML report
npm run test:report
```

Use `.env` (see `.env.example`) to override `BASE_URL` or `API_BASE_URL`.

---

## CI/CD

Every push and PR runs the Playwright matrix on GitHub Actions across Chromium, Firefox, and WebKit. Failures upload the HTML report and trace files as artifacts so they can be opened locally with `npx playwright show-trace`.

See `.github/workflows/playwright.yml`.

---

## Bug reports

The `bug-reports/` folder contains real issues found while exploring these products. Each one follows a structured template — the exact format used in JIRA tickets in production QA work. Examples:

- **BUG-001** — Prompt-injection text accepted in the prompt input without sanitization warning
- **BUG-002** — Mobile pricing-page CTA overlaps the plan card on iPhone 14 viewport
- **BUG-003** — Currency display inconsistency between header and pricing card on regional load

These are illustrative; reproduce against the live sites at your own discretion.

---

## What this project demonstrates (for hiring teams)

| JD requirement | Evidence in repo |
|---|---|
| TypeScript proficiency | Strict TS config, typed POM classes, generics in helpers |
| Self-built portfolio project | Entire repo, original code |
| Read & contribute to complex codebases | Modular architecture, fixtures, ESLint/Prettier setup |
| Test AI-powered video products | `tests/runway/`, `tests/pika/`, `tests/sora/`, `tests/ai-quality/` |
| Bug documentation | `bug-reports/` with structured Markdown reports |
| Cypress / Playwright / Jest | Playwright as the runner; assertion style aligns with Jest |
| Engineering-first QA mindset | Prompt-injection + determinism probes, not just happy-path clicks |

---

## License

MIT — use, fork, learn from it.

## Author

**Afrin Ameer Khan** — QA Engineer / SDET
[LinkedIn](https://linkedin.com/in/afrin-ameerkhan) · afrinameerkhan@gmail.com
