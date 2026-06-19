# Team Anti-Pattern Catalog

<!-- Format: AP-NNN, severity, detector, bad/good example, AI prompt -->

---

### AP-001: Nested None Checking

Severity: medium · Detector: AI + SonarQube cognitive complexity

**Bad:**
```python
if user is not None:
    if user.address is not None:
        if user.address.city is not None:
            process(user.address.city)
```

**Good:**
```python
city = getattr(getattr(user, "address", None), "city", None)
if city:
    process(city)
```

**AI Prompt:** "Detect nested None checks deeper than 2 levels. Suggest early returns, Optional chaining, or default-bearing accessors."

---

### AP-002: Swallowed Exception

Severity: high · Detector: AI

**Bad:**
```python
except Exception:
    print("Error fetching user")
    return None
```

**Good:**
```python
except httpx.HTTPStatusError as e:
    if e.response.status_code == 404:
        return None
    logger.error("user_fetch_failed", user_id=user_id, status=e.response.status_code)
    raise UserServiceError("fetch failed") from e
```

**AI Prompt:** "Refactor the given Python function to handle exceptions properly. Distinguish genuine 404 errors, raise typed errors for network issues, log with structured fields (user_id, status_code, latency), preserve original exception using raise … from."

---

### AP-003: Primitive Obsession

Severity: medium · Detector: AI

**Bad:**
```python
def create_booking(customer_email: str, phone: str, price: float, currency: str): ...
```

**Good:**
```python
def create_booking(customer_email: Email, phone: PhoneNumber, price: Money): ...
```

**AI Prompt:** "Refactor code suffering from Primitive Obsession by identifying string/float parameters used as complex data types and proposing their replacement with custom value objects containing built-in validation."

---

<!-- Add new entries below in the same format -->
