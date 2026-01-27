---
sidebar_position: 3
title: Ignore Patterns
---

# Ignore Patterns

Control which files and findings vlayer reports by using ignore patterns.

## Ignoring Files

### Via Configuration

```json
{
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/fixtures/**",
    "**/seeds/**"
  ]
}
```

### Via .vlayerignore

Create a `.vlayerignore` file (similar to `.gitignore`):

```gitignore
# Dependencies
node_modules/

# Build output
dist/
build/
.next/

# Test files
*.test.ts
*.spec.ts
__tests__/
__mocks__/

# Fixtures and seeds
fixtures/
seeds/
test-data/

# Generated files
*.generated.ts
*.d.ts
```

### Via Command Line

```bash
vlayer scan . --exclude "**/test/**" --exclude "**/*.mock.ts"
```

## Ignoring Findings

### Inline Comments

Ignore the next line:

```typescript
// vlayer-ignore-next-line
const testSSN = "123-45-6789"; // Test fixture
```

Ignore specific rule:

```typescript
// vlayer-ignore-next-line phi
const testSSN = "123-45-6789";
```

Ignore multiple rules:

```typescript
// vlayer-ignore-next-line phi,encryption
const data = md5(testSSN);
```

### Block Ignores

Ignore a block of code:

```typescript
// vlayer-ignore-start
const testPatients = [
  { ssn: "111-11-1111", name: "Test Patient 1" },
  { ssn: "222-22-2222", name: "Test Patient 2" },
];
// vlayer-ignore-end
```

With specific rules:

```typescript
// vlayer-ignore-start phi
const fixtures = {
  validSSN: "123-45-6789",
  invalidSSN: "000-00-0000"
};
// vlayer-ignore-end
```

### File-Level Ignores

Ignore entire file:

```typescript
// vlayer-ignore-file
// This file contains test fixtures

export const testData = {
  patients: [/* ... */]
};
```

Ignore specific rules in file:

```typescript
// vlayer-ignore-file phi,encryption
// Test utilities with mock data
```

## Ignore Configuration

### By Rule ID

```json
{
  "ignoreRules": [
    "phi-ssn-pattern",
    "encryption-md5"
  ]
}
```

### By Severity

```json
{
  "severity": "high"
}
```

Only reports HIGH and CRITICAL findings.

### By Path Pattern

```json
{
  "ignorePatterns": [
    {
      "pattern": "**/fixtures/**",
      "rules": ["phi"]
    },
    {
      "pattern": "**/legacy/**",
      "rules": ["encryption"]
    }
  ]
}
```

## Best Practices

### Do Ignore

- **Test fixtures** - Mock data for testing
- **Documentation examples** - Sample code in docs
- **Third-party code** - Vendored dependencies
- **Generated code** - Auto-generated files

### Don't Ignore

- **Production code** - Never ignore real issues
- **Entire categories** - Address root causes instead
- **Without review** - Always understand why you're ignoring

### Document Ignores

Add context to your ignores:

```typescript
// vlayer-ignore-next-line phi -- Test data, not real PHI
const testSSN = "123-45-6789";
```

### Review Periodically

Track ignores and review them:

```bash
# Find all ignores in codebase
grep -r "vlayer-ignore" --include="*.ts" ./src
```

## Baseline Ignores

For legacy codebases, create a baseline:

```bash
# Generate baseline of current findings
vlayer scan . -f json -o .vlayer-baseline.json

# Future scans compare against baseline
vlayer scan . --baseline .vlayer-baseline.json
```

Only new findings are reported, allowing gradual cleanup.

### Updating Baseline

```bash
# After fixing issues, update baseline
vlayer scan . -f json -o .vlayer-baseline.json
```

## CI/CD Considerations

In CI, you might want stricter rules:

```yaml
# .github/workflows/compliance.yml
- name: HIPAA Compliance Check
  run: |
    # Fail on any HIGH or CRITICAL, even if ignored locally
    vlayer scan . --no-ignore --fail-on high
```

## See Also

- [Configuration](./) - All configuration options
- [Custom Rules](./yaml-rules) - Create targeted rules
