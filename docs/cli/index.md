---
sidebar_position: 1
title: CLI Overview
---

# CLI Reference

vlayer provides a command-line interface for scanning projects and generating reports.

## Basic Usage

```bash
vlayer <command> [options]
```

## Available Commands

| Command | Description |
|---------|-------------|
| [`scan`](./scan) | Scan a directory for HIPAA compliance issues |
| [`fix`](./fix) | Auto-fix common compliance issues |
| [`report`](./report) | Generate reports from previous scans |

## Global Options

These options work with all commands:

| Option | Description |
|--------|-------------|
| `-v, --version` | Show version number |
| `-h, --help` | Show help |
| `--verbose` | Enable verbose output |
| `--quiet` | Suppress non-essential output |
| `--no-color` | Disable colored output |

## Examples

```bash
# Show version
vlayer --version

# Get help for a command
vlayer scan --help

# Run a scan with verbose output
vlayer scan . --verbose

# Quiet mode for CI
vlayer scan . --quiet
```

## Configuration File

vlayer can be configured via a `.vlayerrc.json` or `vlayer.config.js` file in your project root. See [Configuration](../configuration/) for details.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success (no findings or only LOW) |
| 1 | Findings with MEDIUM or HIGH severity |
| 2 | Findings with CRITICAL severity |
| 3 | Error during execution |

Use exit codes in CI/CD pipelines:

```bash
vlayer scan . && echo "Compliant!" || echo "Issues found"
```
