# Design Guidelines

## Visual Direction

- Use CodeSprint tokens from `frontend/src/utils/designTokens.js`.
- Keep the terminal-inspired visual style consistent.
- Prefer reusable primitives from `frontend/src/utils/sharedComponents.jsx`.

## Component Rules

- Reusable UI belongs in `frontend/src/components/`.
- Page-level assemblies belong in `frontend/src/pages/`.
- Keep presentational components stateless when possible.

## Accessibility

- Ensure keyboard focus styles are visible.
- Keep button and text contrast at accessible levels.
- Provide meaningful loading and error messages for API-backed views.
