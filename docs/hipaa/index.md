---
sidebar_position: 1
title: HIPAA Overview
---

# HIPAA Reference

The Health Insurance Portability and Accountability Act (HIPAA) establishes standards for protecting sensitive patient health information.

## What is HIPAA?

HIPAA is a US federal law enacted in 1996 that:

- Protects patient health information (PHI)
- Sets standards for electronic healthcare transactions
- Requires administrative, physical, and technical safeguards
- Establishes penalties for non-compliance

## HIPAA Rules

HIPAA consists of several rules that affect healthcare software:

| Rule | Focus | Key Requirements |
|------|-------|------------------|
| [Privacy Rule](./privacy-rule) | PHI use and disclosure | Patient consent, minimum necessary |
| [Security Rule](./security-rule) | Technical safeguards | Encryption, access controls, audit logs |
| Breach Notification | Incident response | 60-day notification requirement |
| Enforcement Rule | Penalties | Fines up to $1.5M per violation category |

## Who Must Comply?

### Covered Entities

- Healthcare providers (hospitals, clinics, doctors)
- Health plans (insurers, HMOs)
- Healthcare clearinghouses

### Business Associates

Any entity that handles PHI on behalf of a covered entity:

- Cloud service providers
- Software vendors
- IT consultants
- Billing companies

**If you build healthcare software, you're likely a Business Associate.**

## Protected Health Information (PHI)

PHI includes any individually identifiable health information:

| Category | Examples |
|----------|----------|
| **Identifiers** | Name, SSN, MRN, address, phone, email |
| **Dates** | Birth date, admission date, discharge date |
| **Medical** | Diagnoses, treatments, medications |
| **Financial** | Insurance info, billing records |
| **Biometric** | Fingerprints, voice prints, photos |

### The 18 HIPAA Identifiers

1. Names
2. Geographic data (smaller than state)
3. Dates (except year)
4. Phone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate/license numbers
12. Vehicle identifiers
13. Device identifiers
14. Web URLs
15. IP addresses
16. Biometric identifiers
17. Full-face photographs
18. Any other unique identifier

## Penalties

| Violation Level | Per Violation | Annual Maximum |
|-----------------|---------------|----------------|
| Did Not Know | $100 - $50,000 | $1,500,000 |
| Reasonable Cause | $1,000 - $50,000 | $1,500,000 |
| Willful Neglect (Corrected) | $10,000 - $50,000 | $1,500,000 |
| Willful Neglect (Not Corrected) | $50,000 | $1,500,000 |

Criminal penalties can include up to 10 years imprisonment.

## How vlayer Helps

vlayer automates compliance checks across the HIPAA Security Rule requirements:

| Requirement | vlayer Scanner |
|-------------|----------------|
| §164.312(a)(1) Access Control | [Access Control](../scanners/access) |
| §164.312(a)(2)(iv) Encryption | [Encryption](../scanners/encryption) |
| §164.312(b) Audit Controls | [Audit Logging](../scanners/audit) |
| §164.312(d) Authentication | [Access Control](../scanners/access) |
| §164.514 PHI De-identification | [PHI Detection](../scanners/phi) |
| §164.530(j) Retention | [Data Retention](../scanners/retention) |

## Resources

- [HHS HIPAA Website](https://www.hhs.gov/hipaa/index.html)
- [Security Rule Guidance](https://www.hhs.gov/hipaa/for-professionals/security/guidance/index.html)
- [Breach Portal](https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf)

## See Also

- [Security Rule](./security-rule) - Technical requirements
- [Privacy Rule](./privacy-rule) - PHI handling requirements
