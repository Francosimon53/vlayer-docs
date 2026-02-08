---
sidebar_position: 1
slug: /
title: Introduction
---

# vlayer Documentation

**vlayer** (Verification Layer) is a CLI tool and platform that scans your codebase for HIPAA compliance issues. 163+ detection rules that catch PHI exposures, missing encryption, and access control gaps before they reach production. HIPAA 2026 ready - 15/15 requirements covered.

## What is vlayer?

vlayer automatically analyzes your code across **12 categories** with **163+ detection rules**:

- **PHI Exposure** (28 rules) - Detects SSN, MRN, DOB, diagnosis codes, and other PHI patterns
- **Encryption Standards** (18 rules) - Identifies weak crypto (MD5, DES) and missing TLS
- **Audit Logging** (15 rules) - Verifies proper logging of PHI access and operations
- **Access Control** (24 rules) - Finds SQL injection, XSS, CORS issues, hardcoded credentials
- **Data Retention** (12 rules) - Flags improper data deletion and retention policies
- **Network Segmentation** (14 rules) - Missing network isolation, insecure endpoints
- **Multi-Factor Auth** (8 rules) - Weak authentication, missing MFA
- **Incident Response** (10 rules) - Missing IRP, unmonitored security events
- **Vulnerability Management** (11 rules) - Unpatched dependencies, known CVEs
- **Asset Inventory** (9 rules) - Undocumented PHI storage, shadow IT
- **Session Management** (8 rules) - Weak session configs, missing timeouts
- **Third-Party Risk** (6 rules) - Unsafe vendor integrations, missing BAAs

## 🎯 HIPAA 2026 Ready

vlayer covers **all 15** new HIPAA Security Rule (NPRM 2026) requirements:
- Network Segmentation, Encryption Standards, Multi-Factor Auth
- Audit Log Monitoring, Incident Response, Vulnerability Scanning
- Asset Inventory, Access Controls, Data Minimization
- Secure Configuration, Patch Management, Risk Assessments
- Business Continuity, Security Training, Third-Party Risk

## Quick Start

```bash
# Install globally
npm install -g verification-layer

# Or use with npx (no install needed)
npx vlayer scan ./src

# Scan with HTML report
npx vlayer scan ./src -f html -o report.html

# Check compliance score (0-100)
npx vlayer score ./src

# Auto-fix issues
npx vlayer scan ./src --fix
```

## Why vlayer?

Building healthcare software requires strict compliance with HIPAA regulations. Manual code reviews are time-consuming and error-prone. vlayer automates this process, catching issues early in development when they're cheapest to fix.

### Key Features

| Feature | Description |
|---------|-------------|
| **163+ Detection Rules** | Comprehensive coverage across 12 HIPAA categories |
| **Compliance Score (0-100)** | Track your HIPAA readiness over time |
| **Training Module** | 10 modules, 45+ questions, verifiable certificates |
| **HIPAA Templates** | 5 production-ready policy documents (IRP, BAA, NPP, etc.) |
| **CI/CD Integration** | GitHub Actions, pre-commit hooks, PR comments |
| **Pro Dashboard** | Historical scans, team management at [app.vlayer.app](https://app.vlayer.app) |
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
