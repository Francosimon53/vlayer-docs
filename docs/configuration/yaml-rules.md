---
sidebar_position: 2
title: Custom YAML Rules
---

# Custom YAML Rules

Extend vlayer's detection capabilities by defining custom rules in YAML format.

## Rule File Location

Create a `.vlayer/rules/` directory in your project:

```
your-project/
├── .vlayer/
│   └── rules/
│       ├── phi-custom.yaml
│       └── company-policies.yaml
```

Or specify a custom location:

```json
{
  "rulesDir": "./compliance/vlayer-rules"
}
```

## Rule Structure

```yaml
# .vlayer/rules/custom.yaml
rules:
  - id: custom-phi-pattern
    name: Custom PHI Pattern
    description: Detects our internal patient ID format
    category: phi
    severity: HIGH
    pattern: "PAT-\\d{8}"
    message: "Internal patient ID detected"
    hipaaReference: "§164.514"
    remediation: "Use environment variables or secure storage for patient IDs"

  - id: internal-api-key
    name: Internal API Key
    description: Detects hardcoded internal API keys
    category: access
    severity: CRITICAL
    pattern: "INTERNAL_KEY_[A-Z0-9]{32}"
    message: "Hardcoded internal API key"
    remediation: "Move to environment variables"
```

## Rule Properties

| Property | Required | Description |
|----------|----------|-------------|
| `id` | Yes | Unique identifier |
| `name` | Yes | Human-readable name |
| `description` | No | Detailed description |
| `category` | Yes | `phi`, `encryption`, `audit`, `access`, `retention` |
| `severity` | Yes | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| `pattern` | Yes | Regex pattern to match |
| `message` | Yes | Message shown when detected |
| `hipaaReference` | No | HIPAA section reference |
| `remediation` | No | How to fix the issue |
| `filePattern` | No | Only scan matching files |
| `exclude` | No | Skip matching files |

## Pattern Syntax

Patterns use JavaScript regex syntax:

```yaml
rules:
  # Simple string match
  - id: simple-match
    pattern: "password123"

  # Regex with special characters
  - id: ssn-pattern
    pattern: "\\d{3}-\\d{2}-\\d{4}"

  # Case insensitive
  - id: case-insensitive
    pattern: "(?i)secret"

  # Multi-line
  - id: multi-line
    pattern: "BEGIN PRIVATE KEY[\\s\\S]*?END PRIVATE KEY"
```

## File Filtering

Limit rules to specific files:

```yaml
rules:
  - id: frontend-api-call
    name: Frontend API URL
    category: encryption
    severity: HIGH
    pattern: "http://"
    message: "HTTP URL in frontend code"
    filePattern: "**/*.{js,jsx,ts,tsx}"
    exclude:
      - "**/*.test.*"
      - "**/mocks/**"
```

## Conditional Rules

Apply rules based on context:

```yaml
rules:
  - id: production-debug
    name: Debug in Production
    category: access
    severity: HIGH
    pattern: "DEBUG\\s*=\\s*true"
    message: "Debug mode enabled"
    conditions:
      filePattern: "**/*.env.production"
```

## Examples

### Healthcare-Specific Patterns

```yaml
# .vlayer/rules/healthcare.yaml
rules:
  - id: icd-10-code
    name: ICD-10 Code Hardcoded
    description: ICD-10 diagnosis codes should not be hardcoded
    category: phi
    severity: MEDIUM
    pattern: "[A-Z]\\d{2}(\\.\\d{1,4})?"
    message: "Potential ICD-10 code hardcoded"
    filePattern: "**/*.{ts,js}"
    exclude:
      - "**/constants/**"
      - "**/types/**"

  - id: ndc-code
    name: NDC Drug Code
    description: National Drug Code pattern
    category: phi
    severity: MEDIUM
    pattern: "\\d{5}-\\d{4}-\\d{2}"
    message: "NDC drug code detected"

  - id: hl7-message
    name: HL7 Message
    description: Raw HL7 message in code
    category: phi
    severity: HIGH
    pattern: "MSH\\|\\^~\\\\&\\|"
    message: "Raw HL7 message detected - may contain PHI"
```

### Company Policy Rules

```yaml
# .vlayer/rules/company.yaml
rules:
  - id: console-log
    name: Console Log Statement
    description: Console logs may leak PHI
    category: audit
    severity: LOW
    pattern: "console\\.(log|info|warn|error)"
    message: "Console log detected - ensure no PHI is logged"
    exclude:
      - "**/logger.ts"

  - id: any-type
    name: TypeScript Any Type
    description: Using 'any' type can hide PHI handling issues
    category: access
    severity: LOW
    pattern: ":\\s*any\\b"
    message: "TypeScript 'any' type used"
    filePattern: "**/*.ts"
```

### Encryption Standards

```yaml
# .vlayer/rules/encryption.yaml
rules:
  - id: weak-jwt-algorithm
    name: Weak JWT Algorithm
    description: HS256 is not recommended for production
    category: encryption
    severity: MEDIUM
    pattern: "algorithm:\\s*['\"]HS256['\"]"
    message: "HS256 JWT algorithm - consider RS256"
    remediation: "Use RS256 or ES256 for production"

  - id: disabled-tls-verify
    name: TLS Verification Disabled
    description: Disabling TLS verification is insecure
    category: encryption
    severity: CRITICAL
    pattern: "rejectUnauthorized:\\s*false"
    message: "TLS certificate verification disabled"
```

## Testing Rules

Test your custom rules:

```bash
# Test a specific rule file
vlayer scan . --rules .vlayer/rules/custom.yaml --verbose

# Test rules against a specific file
vlayer scan ./src/api/patients.ts --rules .vlayer/rules/healthcare.yaml
```

## Sharing Rules

Package rules for team sharing:

```bash
# Create npm package
mkdir vlayer-rules-healthcare
cd vlayer-rules-healthcare
npm init

# Add rules
mkdir rules
cp ../your-rules/*.yaml rules/
```

Use in projects:

```json
{
  "rulesPackages": ["vlayer-rules-healthcare"]
}
```

## See Also

- [Scanners](../scanners/) - Built-in detection rules
- [Ignore Patterns](./ignore-patterns) - Suppress specific findings
