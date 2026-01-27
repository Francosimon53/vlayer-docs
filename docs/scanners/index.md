---
sidebar_position: 1
title: Scanners Overview
---

# Scanners

vlayer includes five specialized scanners, each targeting a specific area of HIPAA compliance.

## Scanner Categories

| Scanner | HIPAA Section | What It Checks |
|---------|---------------|----------------|
| [PHI Detection](./phi) | §164.514 | Protected health information exposure |
| [Encryption](./encryption) | §164.312(a)(2)(iv) | Encryption and cryptography standards |
| [Audit Logging](./audit) | §164.312(b) | Audit controls and logging |
| [Access Control](./access) | §164.312(a)(1) | Authentication and authorization |
| [Data Retention](./retention) | §164.530(j) | Data retention and disposal |

## How Scanners Work

Each scanner:

1. **Analyzes files** - Reads source code and configuration files
2. **Applies patterns** - Uses regex and AST analysis to detect issues
3. **Generates findings** - Creates detailed findings with severity and remediation

```typescript
interface Finding {
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  file: string;
  line: number;
  column?: number;
  hipaaReference: string;
  remediation?: string;
}
```

## Severity Levels

| Level | Description | Example |
|-------|-------------|---------|
| **CRITICAL** | Immediate security/compliance risk | Hardcoded PHI, no encryption |
| **HIGH** | Likely compliance violation | Weak hashing, missing auth |
| **MEDIUM** | Potential issue requiring review | Permissive CORS, missing logs |
| **LOW** | Best practice recommendation | No retention policy |

## Running Specific Scanners

Run only certain scanners:

```bash
# Single scanner
vlayer scan . --category phi

# Multiple scanners
vlayer scan . --category phi,encryption,audit
```

## File Types Scanned

By default, vlayer scans:

- **JavaScript/TypeScript**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Configuration**: `.json`, `.yaml`, `.yml`, `.env`
- **Infrastructure**: `Dockerfile`, `docker-compose.yml`

Customize with `--include` and `--exclude`:

```bash
vlayer scan . --include "**/*.py" --exclude "**/test/**"
```

## Extending Scanners

vlayer supports custom rules via YAML configuration. See [Custom Rules](../configuration/yaml-rules) for details.
