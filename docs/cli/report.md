---
sidebar_position: 4
title: report
---

# vlayer report

Generate and manage compliance reports.

## Synopsis

```bash
vlayer report <command> [options]
```

## Commands

| Command | Description |
|---------|-------------|
| `generate` | Generate a report from scan results |
| `compare` | Compare two scan results |
| `summary` | Show summary of previous scans |

## Generate Reports

### From a Scan

The easiest way to generate a report is during scanning:

```bash
vlayer scan . -f html -o report.html
```

### From JSON Results

Generate a report from previously saved JSON results:

```bash
# First, save scan results as JSON
vlayer scan . -f json -o results.json

# Then generate different report formats
vlayer report generate results.json -f html -o report.html
vlayer report generate results.json -f markdown -o REPORT.md
```

## Report Formats

### HTML Report

Interactive HTML report with:
- Executive summary dashboard
- Findings grouped by category
- Severity breakdown charts
- Code snippets with syntax highlighting
- Remediation guidance
- HIPAA reference links

```bash
vlayer scan . -f html -o hipaa-report.html
```

### Markdown Report

Markdown format suitable for:
- GitHub/GitLab issues
- Documentation
- Pull request descriptions

```bash
vlayer scan . -f markdown -o HIPAA-AUDIT.md
```

### JSON Report

Machine-readable format for:
- CI/CD integration
- Custom processing
- Trend analysis

```bash
vlayer scan . -f json -o results.json
```

## Compare Reports

Track compliance progress over time:

```bash
vlayer report compare baseline.json current.json
```

Output:
```
Comparison: baseline.json → current.json

New Issues: 2
  + HIGH: New PHI exposure in src/api/users.ts:45
  + MEDIUM: Missing encryption in src/db/store.ts:12

Resolved: 5
  - CRITICAL: MD5 hash usage (fixed)
  - HIGH: Hardcoded API key (fixed)
  ...

Summary:
  Before: 12 total (1 critical, 3 high, 5 medium, 3 low)
  After:  9 total (0 critical, 3 high, 4 medium, 2 low)

Progress: ↓ 25% reduction in issues
```

## Report Options

| Option | Description |
|--------|-------------|
| `--title <text>` | Custom report title |
| `--include-passing` | Include passing checks |
| `--no-code-snippets` | Omit code snippets |
| `--template <file>` | Custom HTML template |

## Examples

### Custom Title

```bash
vlayer scan . -f html -o report.html --title "Q4 2024 HIPAA Audit"
```

### Include All Checks

```bash
vlayer scan . -f html -o report.html --include-passing
```

Shows both issues and passing compliance checks.

### For Compliance Officers

Generate a report suitable for non-technical stakeholders:

```bash
vlayer scan . -f html -o compliance-report.html \
  --no-code-snippets \
  --title "HIPAA Compliance Status Report"
```

## See Also

- [scan](./scan) - Scan directories
- [GitHub Actions](../integrations/github-actions) - Automated reports in CI
