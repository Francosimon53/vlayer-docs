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

## Try It Now

**No installation required!** Try vlayer directly in your browser:

[![Try in Playground](https://img.shields.io/badge/Try%20in-Playground-7C3AED?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik04IDV2MTRsMTEtN3oiLz48L3N2Zz4=)](https://playground-sandy-gamma.vercel.app)

Paste your code and instantly see HIPAA compliance issues with detailed remediation guidance.

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

- **[Try the Playground](https://playground-sandy-gamma.vercel.app)** - Test vlayer in your browser instantly
- **[Installation Guide](./installation)** - Set up vlayer in your project
- **[Quick Start](./quick-start)** - Run your first scan in 5 minutes

## Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/vlayer/verification-layer/issues)
- **Discord**: [Join our community](https://discord.gg/vlayer)
- **Email**: support@vlayer.dev
