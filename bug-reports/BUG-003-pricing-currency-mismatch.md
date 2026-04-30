# BUG-003 — Pricing currency mismatch between header and pricing card on regional load

| Field | Value |
|---|---|
| **ID** | BUG-003 |
| **Reporter** | Afrin Ameer Khan |
| **Date** | 2026-04-14 |
| **Product / Module** | Pricing page — currency localization |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | Chrome 125 / Geo: UAE / Accept-Language: en-AE |
| **Build** | Production (web) |
| **Repro Rate** | 4/5 (80%) |
| **Status** | Open |

## Summary
When loading the pricing page from a UAE IP with `en-AE` accept-language, the header banner advertises pricing in **USD**, but the plan cards render in **AED**. Users see two different currencies on the same page within ~200ms of each other, causing confusion about the actual charge.

## Steps to reproduce
1. Set browser locale to `en-AE`.
2. Use a UAE-based IP (or VPN to Dubai).
3. Load `/pricing`.
4. Wait for full hydration.

## Expected
- One currency consistently across header banner, plan cards, footer fine-print, and checkout summary.

## Actual
- Header: "Starting at $12/month"
- Plan card: "AED 44 / month"
- Footer: "All prices in USD"

## Impact
- Misleads on actual charge amount; potential consumer-protection issue in some jurisdictions.
- Erodes trust at the conversion-critical page.

## Suggested fix
Make currency a single source of truth (locale resolver in the page-level loader) and pass it down to all child components. Add a snapshot test that asserts only one currency token appears on the rendered page.

## Attachments
- Screenshot: `bug-reports/assets/BUG-003-currency.png` (placeholder)
- HAR: `bug-reports/assets/BUG-003.har` (placeholder)
