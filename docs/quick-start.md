---
sidebar_position: 3
title: Quick Start
---

# Quick Start

Get up and running with vlayer in under 5 minutes.

## Your First Scan

Navigate to your project directory and run:

```bash
vlayer scan .
```

vlayer will analyze your codebase and output findings to the terminal:

```
Scanning project...

PHI Exposure
  ⚠ HIGH: Potential SSN pattern found
    → src/utils/validate.ts:45
    Reference: HIPAA §164.514

  ⚠ MEDIUM: Hardcoded date of birth
    → src/models/patient.ts:12
    Reference: HIPAA §164.514

Encryption
  ✗ CRITICAL: MD5 hash algorithm detected
    → src/auth/password.ts:23
    Reference: HIPAA §164.312(a)(2)(iv)

Audit Logging
  ✓ Logging framework detected (winston)

Access Control
  ✓ Authentication middleware found

Data Retention
  ⚠ LOW: No retention policy detected
    → src/services/cleanup.ts
    Reference: HIPAA §164.530(j)

Summary: 2 critical, 1 high, 1 medium, 1 low
```

## Understanding Severity Levels

| Severity | Description | Action Required |
|----------|-------------|-----------------|
| **CRITICAL** | Immediate security risk | Fix before deploying |
| **HIGH** | Likely compliance violation | Fix soon |
| **MEDIUM** | Potential issue | Review and fix |
| **LOW** | Best practice recommendation | Consider fixing |

## Generating Reports

### HTML Report

Generate a detailed HTML report for sharing with your team:

```bash
vlayer scan . -f html -o hipaa-report.html
```

Open `hipaa-report.html` in your browser to see:
- Summary dashboard
- Findings by category
- Code snippets with line numbers
- Remediation guidance
- HIPAA references

### JSON Report

Export findings as JSON for programmatic processing:

```bash
vlayer scan . -f json -o findings.json
```

### Markdown Report

Generate Markdown for documentation or GitHub issues:

```bash
vlayer scan . -f markdown -o HIPAA-FINDINGS.md
```

## Scanning Specific Directories

Scan only certain parts of your codebase:

```bash
# Scan only the src directory
vlayer scan ./src

# Scan multiple directories
vlayer scan ./src ./lib ./api
```

## Filtering by Category

Focus on specific compliance categories:

```bash
# Only check encryption
vlayer scan . --category encryption

# Check multiple categories
vlayer scan . --category phi,encryption,audit
```

Available categories:
- `phi` - PHI exposure detection
- `encryption` - Encryption standards
- `audit` - Audit logging
- `access` - Access control
- `retention` - Data retention

## Auto-Fix Mode

Let vlayer automatically fix some common issues:

```bash
vlayer scan . --fix
```

:::caution
Auto-fix modifies your code. Always review changes and run tests afterward.
:::

## Exit Codes

vlayer uses exit codes for CI/CD integration:

| Code | Meaning |
|------|---------|
| 0 | No findings or only LOW severity |
| 1 | MEDIUM or higher findings |
| 2 | CRITICAL findings |

Example CI usage:

```bash
vlayer scan . || exit 1
```

## Next Steps

- Learn about the [CLI commands](./cli/) in detail
- Understand what each [scanner](./scanners/) checks for
- Set up [CI/CD integration](./integrations/github-actions)
- Configure vlayer with [custom rules](./configuration/yaml-rules)
