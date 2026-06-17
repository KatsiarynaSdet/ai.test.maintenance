# Project Context

## Domain Rules
- Money = integers only (no floats)
- Eventual consistency is expected
- DB queries → parameterized only
- Validate Content-Type on all endpoints
- Retries → exponential backoff

## External test sites
- tests/documentation.spec.ts targets external site playwright.dev — hardcoded URL is intentional

## Ignore
- generated/**
- migrations/**

## Severity
BLOCK:
- SQL injection
- hardcoded secrets
- swallowed exceptions (including .catch(() => null) in tests)
- float money

WARN:
- magic numbers
- primitive obsession

IGNORE:
- missing docstrings
- formatting
- style
