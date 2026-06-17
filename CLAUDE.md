# Project Context

## Domain Rules
- Money = integers only (no floats)
- Eventual consistency is expected
- DB queries → parameterized only
- Validate Content-Type on all endpoints
- Retries → exponential backoff

## Ignore
- generated/**
- migrations/**

## Severity
BLOCK:
- SQL injection
- hardcoded secrets
- swallowed exceptions
- float money

WARN:
- magic numbers
- primitive obsession

IGNORE:
- missing docstrings
- formatting
- style
