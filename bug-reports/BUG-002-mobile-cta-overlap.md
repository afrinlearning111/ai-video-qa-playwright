# BUG-002 — Mobile pricing-page CTA overlaps the plan card on iPhone 14 viewport

| Field | Value |
|---|---|
| **ID** | BUG-002 |
| **Reporter** | Afrin Ameer Khan |
| **Date** | 2026-04-13 |
| **Product / Module** | Pricing page (mobile) |
| **Severity** | High |
| **Priority** | P2 |
| **Environment** | iPhone 14 emulation in Playwright (390×844) / Safari 17 |
| **Build** | Production (web) |
| **Repro Rate** | 5/5 (100%) |
| **Status** | Open |

## Summary
On the 390×844 iPhone 14 viewport, the "Subscribe" CTA on the highest-tier plan card overlaps the plan title text by approximately 12px. The CTA is still tappable, but the plan name is partially obscured by the rounded button corner.

## Steps to reproduce
1. Open the pricing page in mobile emulation (Playwright project: `mobile-safari`).
2. Scroll to the third plan card.
3. Observe the overlap in the upper-left corner of the CTA.

## Expected
- CTA sits inside the card padding with at least 8px gap to all neighbouring elements.

## Actual
- CTA bleeds into the plan title's bounding box. Visible at viewport widths 380–410px.

## Impact
- Visual polish is critical on a paywall page; this is a conversion-funnel surface.
- Potential A11y issue: hit target may be confusing for users with motor impairments.

## Suggested fix
Add `padding-top: 16px` to the CTA wrapper at breakpoint `<480px`, or switch the card to a CSS grid with explicit row gap.

## Attachments
- Screenshot diff: `bug-reports/assets/BUG-002-iphone14.png` (placeholder)

## Related
- BUG-005 (header overlap on Pixel 7) — likely same media-query gap
