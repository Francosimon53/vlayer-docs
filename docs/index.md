---
sidebar_position: 1
slug: /
title: Introduction
---

# vlayer Documentation

**vlayer** (Verification Layer) is an open-source CLI tool that scans your codebase for HIPAA compliance issues. It helps healthcare software developers identify and fix potential violations before they become problems.

## What is vlayer?

vlayer automatically analyzes your code for:

- **PHI Exposure** - Detects hardcoded Social Security numbers, medical record numbers, dates of birth, and other protected health information
- **Encryption Standards** - Identifies weak cryptographic algorithms and missing encryption
- **Audit Logging** - Verifies proper logging of PHI access
- **Access Control** - Finds authentication bypasses and permission issues
- **Data Retention** - Flags improper data deletion practices

## Quick Example

```bash
# Install vlayer
npm install -g verification-layer

# Scan your project
vlayer scan ./my-healthcare-app

# Generate an HTML report
vlayer scan ./my-healthcare-app -f html -o report.html
```

## Why vlayer?

Building healthcare software requires strict compliance with HIPAA regulations. Manual code reviews are time-consuming and error-prone. vlayer automates this process, catching issues early in development when they're cheapest to fix.

### Key Benefits

| Feature | Benefit |
|---------|---------|
| **Automated Scanning** | Catch issues in seconds, not hours |
| **CI/CD Integration** | Block non-compliant code automatically |
| **Detailed Reports** | Get actionable remediation guidance |
| **HIPAA References** | Learn which regulations apply |
| **Open Source** | Free to use, audit, and extend |

## Getting Started

Ready to start scanning? Follow our [Installation Guide](./installation) to set up vlayer in your project.

## Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/vlayer/verification-layer/issues)
- **Discord**: [Join our community](https://discord.gg/vlayer)
- **Email**: support@vlayer.dev
