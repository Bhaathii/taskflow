# Palette's Journal

## 2025-02-20 - Initial Setup
**Learning:** The repo uses standard CSS and React. A11y is partially present (visually-hidden class exists) but inconsistent (missing ARIA labels on inputs/buttons).
**Action:** Always check for `aria-label` or `htmlFor` on inputs. Add `role="group"` for button groups acting as radio/tabs.
