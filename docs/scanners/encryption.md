---
sidebar_position: 3
title: Encryption
---

# Encryption Scanner

The Encryption scanner identifies weak cryptographic practices and missing encryption that could expose protected health information.

## HIPAA Reference

**§164.312(a)(2)(iv) - Encryption and decryption**

> Implement a mechanism to encrypt and decrypt electronic protected health information.

**§164.312(e)(2)(ii) - Encryption**

> Implement a mechanism to encrypt electronic protected health information whenever deemed appropriate.

## What It Detects

### Weak Hash Algorithms

```typescript
// ❌ CRITICAL: MD5 is cryptographically broken
const hash = crypto.createHash('md5').update(password).digest('hex');

// ❌ HIGH: SHA-1 is deprecated
const hash = crypto.createHash('sha1').update(data).digest('hex');

// ✓ Safe: SHA-256 or better
const hash = crypto.createHash('sha256').update(data).digest('hex');
```

### Weak Encryption Algorithms

```typescript
// ❌ CRITICAL: DES is broken
const cipher = crypto.createCipheriv('des', key, iv);

// ❌ HIGH: 3DES is deprecated
const cipher = crypto.createCipheriv('des-ede3', key, iv);

// ❌ MEDIUM: ECB mode is insecure
const cipher = crypto.createCipheriv('aes-256-ecb', key, null);

// ✓ Safe: AES-256-GCM
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
```

### Missing TLS/HTTPS

```typescript
// ❌ HIGH: Unencrypted HTTP
const apiUrl = 'http://api.healthcare.com/patients';
fetch('http://internal-service/data');

// ✓ Safe: HTTPS
const apiUrl = 'https://api.healthcare.com/patients';
```

### Hardcoded Encryption Keys

```typescript
// ❌ CRITICAL: Hardcoded key
const encryptionKey = 'my-secret-key-12345';
const iv = Buffer.from('1234567890123456');

// ✓ Safe: Key from secure source
const encryptionKey = process.env.ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);
```

### Insecure Random Number Generation

```typescript
// ❌ MEDIUM: Math.random() for security
const token = Math.random().toString(36);

// ✓ Safe: Cryptographic random
const token = crypto.randomBytes(32).toString('hex');
```

## Detection Rules

| Issue | Severity | Pattern |
|-------|----------|---------|
| MD5 hashing | CRITICAL | `createHash('md5')` |
| SHA-1 hashing | HIGH | `createHash('sha1')` |
| DES encryption | CRITICAL | `createCipheriv('des` |
| 3DES encryption | HIGH | `des-ede3`, `des3` |
| ECB mode | HIGH | `aes-*-ecb` |
| HTTP URLs | HIGH | `http://` (not localhost) |
| Hardcoded keys | CRITICAL | Key-like strings |
| Weak PRNG | MEDIUM | `Math.random()` for tokens |

## Configuration

```json
{
  "scanners": {
    "encryption": {
      "allowHttp": [
        "localhost",
        "127.0.0.1",
        "*.internal"
      ],
      "minimumKeyLength": 256,
      "allowedAlgorithms": [
        "aes-256-gcm",
        "aes-256-cbc",
        "chacha20-poly1305"
      ]
    }
  }
}
```

## Remediation

### Replace Weak Hashing

```typescript
// Before
const hash = crypto.createHash('md5').update(data).digest('hex');

// After - for integrity checking
const hash = crypto.createHash('sha256').update(data).digest('hex');

// After - for passwords (use bcrypt or argon2)
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);
```

### Use Strong Encryption

```typescript
import crypto from 'crypto';

// AES-256-GCM encryption
function encrypt(text: string, key: Buffer): EncryptedData {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    iv: iv.toString('hex'),
    data: encrypted,
    tag: cipher.getAuthTag().toString('hex')
  };
}
```

### Enforce HTTPS

```typescript
// API client with HTTPS enforcement
const client = axios.create({
  baseURL: process.env.API_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  })
});

// Validate URLs
function validateUrl(url: string): void {
  if (!url.startsWith('https://')) {
    throw new Error('HTTPS required for external connections');
  }
}
```

### Secure Key Management

```typescript
// Use environment variables
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

// Or use a key management service
import { KMS } from 'aws-sdk';
const kms = new KMS();
const { Plaintext } = await kms.decrypt({
  CiphertextBlob: encryptedKey
}).promise();
```

## Auto-Fix Support

The `--fix` flag can automatically fix:

- ✅ MD5 → SHA-256
- ✅ HTTP → HTTPS URLs
- ❌ Key management (manual)
- ❌ Algorithm upgrades (manual review required)

```bash
vlayer scan . --fix --category encryption
```

## See Also

- [HIPAA Security Rule](../hipaa/security-rule) - Full security requirements
- [Access Control](./access) - Authentication requirements
