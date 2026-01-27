---
sidebar_position: 1
title: Integrations Overview
---

# Integrations

vlayer integrates with your development workflow at multiple points to catch compliance issues early.

## Integration Points

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Lifecycle                      │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│   Coding    │   Commit    │     CI      │      Deploy         │
├─────────────┼─────────────┼─────────────┼─────────────────────┤
│  VS Code    │  Pre-commit │   GitHub    │   Block deploys     │
│  Extension  │    Hook     │   Actions   │   if non-compliant  │
└─────────────┴─────────────┴─────────────┴─────────────────────┘
```

## Available Integrations

| Integration | Description | Setup Time |
|-------------|-------------|------------|
| [VS Code Extension](./vscode) | Real-time feedback while coding | 2 min |
| [GitHub Actions](./github-actions) | Automated CI/CD checks | 5 min |
| [GitLab CI](./gitlab-ci) | GitLab pipeline integration | 5 min |
| Pre-commit Hook | Check before committing | 2 min |

## Quick Setup: Pre-commit Hook

Add vlayer to your Git hooks:

```bash
# Using husky
npx husky add .husky/pre-commit "npx vlayer scan . --fail-on high"
```

Or manually in `.git/hooks/pre-commit`:

```bash
#!/bin/sh
npx vlayer scan . --fail-on high
if [ $? -ne 0 ]; then
  echo "HIPAA compliance check failed. Fix issues before committing."
  exit 1
fi
```

## Integration Features

### Exit Codes

All integrations use consistent exit codes:

| Code | Meaning | CI Action |
|------|---------|-----------|
| 0 | Pass | Continue |
| 1 | Findings (non-critical) | Warning/Continue |
| 2 | Critical findings | Fail build |
| 3 | Error | Fail build |

### Report Artifacts

Generate reports as CI artifacts:

```yaml
# GitHub Actions example
- name: Run vlayer
  run: vlayer scan . -f html -o hipaa-report.html

- name: Upload Report
  uses: actions/upload-artifact@v3
  with:
    name: hipaa-compliance-report
    path: hipaa-report.html
```

### PR Comments

Post findings as PR comments (GitHub Actions):

```yaml
- name: vlayer scan
  run: vlayer scan . -f json -o findings.json

- name: Comment on PR
  uses: actions/github-script@v6
  with:
    script: |
      const findings = require('./findings.json');
      // Format and post comment
```

## Configuration for CI

Create a CI-specific config:

```json
// .vlayerrc.ci.json
{
  "severity": "medium",
  "failOn": "high",
  "format": "json",
  "exclude": [
    "**/node_modules/**",
    "**/test/**"
  ]
}
```

Use in CI:

```bash
vlayer scan . --config .vlayerrc.ci.json
```

## See Also

- [VS Code Extension](./vscode) - IDE integration
- [GitHub Actions](./github-actions) - CI setup guide
- [GitLab CI](./gitlab-ci) - GitLab setup guide
