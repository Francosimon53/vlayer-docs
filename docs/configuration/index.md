---
sidebar_position: 1
title: Configuration Overview
---

# Configuration

vlayer can be configured through configuration files, command-line options, or environment variables.

## Configuration File

Create a `.vlayerrc.json` file in your project root:

```json
{
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/*.test.ts"
  ],
  "severity": "medium",
  "format": "text",
  "scanners": {
    "phi": {
      "enabled": true
    },
    "encryption": {
      "enabled": true
    },
    "audit": {
      "enabled": true
    },
    "access": {
      "enabled": true
    },
    "retention": {
      "enabled": true
    }
  }
}
```

## Alternative Config Formats

vlayer also supports:

- `.vlayerrc.yaml` / `.vlayerrc.yml`
- `vlayer.config.js`
- `vlayer.config.mjs`
- `package.json` (under `"vlayer"` key)

### YAML Example

```yaml
# .vlayerrc.yaml
exclude:
  - "**/node_modules/**"
  - "**/dist/**"

severity: medium

scanners:
  phi:
    enabled: true
    patterns:
      ssn: true
      mrn: true
  encryption:
    enabled: true
    allowedAlgorithms:
      - aes-256-gcm
```

### JavaScript Example

```javascript
// vlayer.config.js
module.exports = {
  exclude: ['**/node_modules/**'],
  severity: 'medium',
  scanners: {
    phi: { enabled: true },
    encryption: { enabled: true }
  }
};
```

## Configuration Options

### Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `exclude` | `string[]` | `['node_modules']` | Glob patterns to exclude |
| `include` | `string[]` | `['**/*']` | Glob patterns to include |
| `severity` | `string` | `'low'` | Minimum severity to report |
| `format` | `string` | `'text'` | Output format |
| `failOn` | `string` | `'critical'` | Exit with error if severity >= |

### Scanner Options

Each scanner can be configured individually:

```json
{
  "scanners": {
    "<scanner-name>": {
      "enabled": true,
      "exclude": [],
      "options": {}
    }
  }
}
```

## Environment Variables

Override configuration with environment variables:

| Variable | Description |
|----------|-------------|
| `VLAYER_CONFIG` | Path to config file |
| `VLAYER_SEVERITY` | Minimum severity |
| `VLAYER_FORMAT` | Output format |
| `VLAYER_FAIL_ON` | Fail threshold |

```bash
VLAYER_SEVERITY=high vlayer scan .
```

## Configuration Precedence

Configuration is merged in this order (later overrides earlier):

1. Default values
2. Config file (`.vlayerrc.json`)
3. Environment variables
4. Command-line arguments

## See Also

- [Custom YAML Rules](./yaml-rules) - Define custom detection rules
- [Ignore Patterns](./ignore-patterns) - Exclude files and findings
