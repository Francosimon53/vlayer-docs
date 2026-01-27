---
sidebar_position: 2
title: scan
---

# vlayer scan

Scan a directory for HIPAA compliance issues.

## Synopsis

```bash
vlayer scan <path> [options]
```

## Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `path` | Directory or file to scan | `.` (current directory) |

## Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--format <type>` | `-f` | Output format: `text`, `json`, `html`, `markdown` |
| `--output <file>` | `-o` | Write report to file |
| `--category <cats>` | `-c` | Comma-separated categories to scan |
| `--severity <level>` | `-s` | Minimum severity: `low`, `medium`, `high`, `critical` |
| `--exclude <patterns>` | `-e` | Glob patterns to exclude |
| `--config <file>` | | Path to config file |
| `--fix` | | Auto-fix issues where possible |
| `--fail-on <level>` | | Exit with error if severity >= level |

## Categories

Available categories:
- `phi` - Protected Health Information detection
- `encryption` - Encryption and cryptography
- `audit` - Audit logging
- `access` - Access control
- `retention` - Data retention

## Examples

### Basic Scan

```bash
# Scan current directory
vlayer scan .

# Scan specific directory
vlayer scan ./src
```

### Output Formats

```bash
# JSON output
vlayer scan . -f json

# HTML report
vlayer scan . -f html -o report.html

# Markdown
vlayer scan . -f markdown -o FINDINGS.md
```

### Filtering

```bash
# Only PHI and encryption
vlayer scan . -c phi,encryption

# High and critical only
vlayer scan . -s high

# Exclude test files
vlayer scan . -e "**/*.test.ts" -e "**/node_modules/**"
```

### CI/CD Usage

```bash
# Fail on high or critical
vlayer scan . --fail-on high

# Quiet mode with JSON output
vlayer scan . --quiet -f json -o results.json
```

## Output Format

### Text (Default)

```
PHI Exposure
  ⚠ HIGH: Potential SSN pattern found
    → src/utils/validate.ts:45
    Reference: HIPAA §164.514

Summary: 1 high, 0 medium, 0 low
```

### JSON

```json
{
  "scanDate": "2024-01-15T10:30:00Z",
  "findings": [
    {
      "category": "phi",
      "severity": "HIGH",
      "message": "Potential SSN pattern found",
      "file": "src/utils/validate.ts",
      "line": 45,
      "hipaaReference": "§164.514"
    }
  ],
  "summary": {
    "critical": 0,
    "high": 1,
    "medium": 0,
    "low": 0
  }
}
```

## See Also

- [fix](./fix) - Auto-fix issues
- [report](./report) - Generate reports
- [Configuration](../configuration/) - Config file options
