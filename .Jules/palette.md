## 2024-10-24 - Accessibility Patterns
**Learning:** React applications often lack utility classes for screen-reader-only content, leading to developers skipping labels or using placeholder text as labels.
**Action:** Always check for and add a `.visually-hidden` or `.sr-only` utility class early to encourage accessible labeling without compromising visual design.

## 2025-05-23 - Form Accessibility Gaps
**Learning:** Inline edit forms in list items (like `TaskItem`) are high-risk areas for missing labels because they are visually implicit but semantically ambiguous to screen readers.
**Action:** When auditing list components with edit capabilities, specifically check that the edit mode inputs have `aria-label` or linked `<label>` elements matching the list item's content.
