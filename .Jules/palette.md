## 2024-10-24 - Accessibility Patterns
**Learning:** React applications often lack utility classes for screen-reader-only content, leading to developers skipping labels or using placeholder text as labels.
**Action:** Always check for and add a `.visually-hidden` or `.sr-only` utility class early to encourage accessible labeling without compromising visual design.

## 2024-10-26 - Dynamic Button Labels in Tests
**Learning:** When adding `aria-label` to buttons with dynamic text (like "Smart Mode" toggles), Playwright's `get_by_role` prioritizes the `aria-label` over visible text. Tests relying on visible text selectors will fail immediately upon adding accessibility attributes.
**Action:** When improving accessibility, simultaneously update E2E tests to select by the new accessible name (the `aria-label` value) rather than visible text to ensure robust testing of the actual screen reader experience.
