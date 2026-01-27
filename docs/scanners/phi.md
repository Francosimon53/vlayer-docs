---
sidebar_position: 2
title: PHI Detection
---

# PHI Detection Scanner

The PHI (Protected Health Information) scanner identifies potential exposure of sensitive health data in your codebase.

## HIPAA Reference

**§164.514 - Other requirements relating to uses and disclosures of protected health information**

PHI includes any individually identifiable health information, including:
- Medical record numbers
- Social Security numbers
- Dates (birth, admission, discharge, death)
- Names, addresses, phone numbers
- Email addresses, URLs, IP addresses
- Biometric identifiers
- Full-face photographs

## What It Detects

### Social Security Numbers

```typescript
// ❌ Detected
const ssn = "123-45-6789";
const testSSN = "123456789";

// ✓ Safe - using environment variables
const ssn = process.env.PATIENT_SSN;
```

### Medical Record Numbers

```typescript
// ❌ Detected
const mrn = "MRN12345678";
const patientId = "PT-2024-001234";

// ✓ Safe - dynamically generated
const mrn = generateMRN();
```

### Dates of Birth

```typescript
// ❌ Detected
const dob = "1990-05-15";
const birthDate = new Date("05/15/1990");

// ✓ Safe - from secure source
const dob = patient.getDateOfBirth();
```

### Healthcare Identifiers

```typescript
// ❌ Detected
const npi = "1234567890";  // National Provider Identifier
const dea = "AB1234567";   // DEA Number

// ✓ Safe
const npi = config.get('provider.npi');
```

## Detection Patterns

| Pattern | Example | Severity |
|---------|---------|----------|
| SSN (XXX-XX-XXXX) | `123-45-6789` | HIGH |
| SSN (9 digits) | `123456789` | MEDIUM |
| MRN patterns | `MRN12345` | HIGH |
| DOB in code | `"1990-01-15"` | MEDIUM |
| NPI (10 digits) | `1234567890` | MEDIUM |
| DEA number | `AB1234567` | MEDIUM |

## Configuration

Customize PHI detection in `.vlayerrc.json`:

```json
{
  "scanners": {
    "phi": {
      "patterns": {
        "ssn": true,
        "mrn": true,
        "dob": true,
        "npi": true,
        "custom": [
          {
            "name": "internal-patient-id",
            "pattern": "PAT-\\d{8}",
            "severity": "HIGH"
          }
        ]
      },
      "exclude": [
        "**/test/**",
        "**/*.test.ts"
      ]
    }
  }
}
```

## False Positives

The PHI scanner may flag legitimate test data or documentation. Handle false positives:

### Inline Ignore

```typescript
// vlayer-ignore-next-line phi
const testSSN = "123-45-6789"; // Test data only
```

### File-Level Ignore

```typescript
// vlayer-ignore-file phi
// This file contains test fixtures
export const testPatients = [
  { ssn: "111-11-1111", name: "Test Patient" }
];
```

### Configuration Exclude

```json
{
  "scanners": {
    "phi": {
      "exclude": [
        "**/fixtures/**",
        "**/seeds/**"
      ]
    }
  }
}
```

## Remediation

### Remove Hardcoded PHI

```typescript
// Before
const patientSSN = "123-45-6789";

// After - use environment variables
const patientSSN = process.env.PATIENT_SSN;

// After - use secure storage
const patientSSN = await vault.getSecret('patient-ssn');
```

### Encrypt PHI at Rest

```typescript
import { encrypt, decrypt } from './crypto';

// Store encrypted
const encryptedSSN = encrypt(ssn);
await db.patients.update({ id, ssn: encryptedSSN });

// Retrieve and decrypt
const patient = await db.patients.find(id);
const ssn = decrypt(patient.ssn);
```

### Use Tokenization

```typescript
// Replace PHI with tokens
const token = tokenize(ssn);
await db.patients.update({ id, ssnToken: token });

// Detokenize only when needed
const ssn = detokenize(token);
```

## See Also

- [HIPAA Privacy Rule](../hipaa/privacy-rule) - Full privacy requirements
- [Encryption Scanner](./encryption) - Securing PHI at rest
