# Suite Maintenance Summary

## Before

* Mixed responsibilities in Page Objects (cross-page checks)
* Outdated `guides` references (locators + URLs)
* Fragile text-based selectors
* High duplication in pages and tests
* Weak assertions (visibility only)
* Hardcoded waits (`waitForTimeout`)
* Inconsistent URL validation
* Naming mismatches (button vs link)

---

## After

* Clear page ownership (no cross-page checks)
* `guides` fully removed → `/docs` aligned
* Role-based, stable locators
* Reusable locators (getters)
* Reduced duplication (data-driven tests)
* Stronger assertions (state + href + accessibility)
* No hard waits (auto-wait + expect)
* URL checks only in tests
* Consistent, semantic naming

---

## Result

* More stable tests
* Less duplication
* Easier maintenance
* Cleaner architecture
