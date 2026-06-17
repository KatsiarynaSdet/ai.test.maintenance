# generate-test-cases

## When to apply
When asked to generate, create, or write test cases from requirements, tickets, or specs.

## Procedure
1. Identify happy path
2. Identify edge cases
3. Identify negative cases
4. Map each test to requirement ID
5. Generate Playwright TypeScript code following existing patterns in tests/

## Rules
- Never use .catch(() => null)
- Always use explicit assertions
- Follow page object pattern from src/pages/
