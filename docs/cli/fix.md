---
sidebar_position: 3
title: fix
---

# vlayer fix

Automatically fix common HIPAA compliance issues in your codebase.

## Synopsis

```bash
vlayer scan <path> --fix [options]
```

:::caution
Auto-fix modifies your source files. Always commit or stash changes before running, and review all modifications afterward.
:::

## What Can Be Fixed?

| Category | Issue | Fix Applied |
|----------|-------|-------------|
| Encryption | MD5 usage | Replace with SHA-256 |
| Encryption | DES encryption | Replace with AES-256 |
| Encryption | HTTP URLs | Replace with HTTPS |
| Access | Hardcoded credentials | Move to environment variables |
| Audit | Missing logger import | Add logging import |

## What Cannot Be Fixed?

Some issues require manual intervention:
- PHI exposure in code comments
- Complex authentication logic
- Data retention policy implementation
- Custom encryption schemes

## Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would be fixed without making changes |
| `--interactive` | Prompt before each fix |
| `--backup` | Create `.bak` files before modifying |

## Examples

### Preview Changes

```bash
vlayer scan . --fix --dry-run
```

Output:
```
Dry run - no files will be modified

Would fix:
  src/auth/hash.ts:23
    - const hash = crypto.createHash('md5')
    + const hash = crypto.createHash('sha256')

  src/api/client.ts:15
    - const API_URL = 'http://api.example.com'
    + const API_URL = 'https://api.example.com'

2 fixes available
```

### Interactive Mode

```bash
vlayer scan . --fix --interactive
```

Output:
```
src/auth/hash.ts:23
Replace MD5 with SHA-256?

  - const hash = crypto.createHash('md5')
  + const hash = crypto.createHash('sha256')

Apply fix? (y/n/a/q)
  y = yes, n = no, a = all remaining, q = quit
```

### With Backup

```bash
vlayer scan . --fix --backup
```

Creates `file.ts.bak` before modifying `file.ts`.

## Fix Categories

### Encryption Fixes

**MD5 to SHA-256:**
```typescript
// Before
const hash = crypto.createHash('md5').update(data).digest('hex');

// After
const hash = crypto.createHash('sha256').update(data).digest('hex');
```

**HTTP to HTTPS:**
```typescript
// Before
const endpoint = 'http://api.example.com/data';

// After
const endpoint = 'https://api.example.com/data';
```

### Access Control Fixes

**Hardcoded Credentials:**
```typescript
// Before
const API_KEY = 'sk-12345abcdef';

// After
const API_KEY = process.env.API_KEY;
```

## Best Practices

1. **Always review changes** - Auto-fix is helpful but not perfect
2. **Run tests after fixing** - Ensure functionality isn't broken
3. **Use version control** - Commit before running `--fix`
4. **Start with `--dry-run`** - Preview changes first

## See Also

- [scan](./scan) - Scan without fixing
- [Configuration](../configuration/) - Customize fix behavior
