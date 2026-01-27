---
sidebar_position: 6
title: Data Retention
---

# Data Retention Scanner

The Data Retention scanner identifies issues with data lifecycle management, including improper deletion practices and missing retention policies.

## HIPAA Reference

**§164.530(j) - Retention period**

> A covered entity must retain the documentation required by paragraph (j)(1) of this section for 6 years from the date of its creation or the date when it last was in effect, whichever is later.

**§164.310(d)(2)(i) - Disposal**

> Implement policies and procedures to address the final disposition of electronic protected health information, and/or the hardware or electronic media on which it is stored.

## What It Detects

### Hard Deletes Without Soft Delete

```typescript
// ❌ MEDIUM: Permanent deletion
async function deletePatient(id: string) {
  await db.patients.delete({ where: { id } });
}

// ✓ Soft delete for compliance
async function deletePatient(id: string) {
  await db.patients.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: 'deleted'
    }
  });
}
```

### Missing Retention Period

```typescript
// ❌ LOW: No retention policy
class PatientService {
  async cleanup() {
    // Deletes all old records
    await db.patients.deleteMany({
      where: { lastAccess: { lt: oneYearAgo } }
    });
  }
}

// ✓ HIPAA-compliant retention
class PatientService {
  static RETENTION_YEARS = 6; // HIPAA minimum

  async cleanup() {
    const retentionDate = subYears(new Date(), this.RETENTION_YEARS);

    // Only delete after retention period
    await db.patients.deleteMany({
      where: {
        deletedAt: { lt: retentionDate },
        status: 'deleted'
      }
    });
  }
}
```

### Insecure Data Disposal

```typescript
// ❌ HIGH: Simple assignment doesn't securely erase
patient.ssn = null;
patient.medicalHistory = [];

// ✓ Secure erasure
import { secureErase } from './crypto';

await secureErase(patient.ssn);
await db.patients.update({
  where: { id: patient.id },
  data: {
    ssn: null,
    medicalHistory: null,
    erasedAt: new Date()
  }
});
```

### CASCADE DELETE on PHI Tables

```sql
-- ❌ HIGH: Cascading deletes can violate retention
CREATE TABLE medical_records (
  patient_id INT REFERENCES patients(id) ON DELETE CASCADE
);

-- ✓ Prevent accidental deletion
CREATE TABLE medical_records (
  patient_id INT REFERENCES patients(id) ON DELETE RESTRICT
);
```

### Backup Without Retention Policy

```typescript
// ❌ LOW: No backup retention
async function backup() {
  await copyDatabase('backup-' + Date.now());
}

// ✓ Managed backup lifecycle
async function backup() {
  const backupId = await copyDatabase('backup-' + Date.now());

  await db.backups.create({
    data: {
      id: backupId,
      createdAt: new Date(),
      retainUntil: addYears(new Date(), 6)
    }
  });
}
```

## Detection Rules

| Issue | Severity | Description |
|-------|----------|-------------|
| Hard delete on PHI | MEDIUM | Permanent deletion without soft delete |
| No retention constant | LOW | Missing retention period definition |
| Retention < 6 years | HIGH | Below HIPAA minimum |
| CASCADE DELETE | HIGH | Automatic deletion on foreign key |
| No deletion audit | MEDIUM | Deletes without logging |
| Insecure erasure | MEDIUM | Simple null without secure wipe |

## Configuration

```json
{
  "scanners": {
    "retention": {
      "minimumRetentionYears": 6,
      "phiTables": [
        "patients",
        "medical_records",
        "prescriptions",
        "lab_results"
      ],
      "deleteMethods": [
        "delete",
        "deleteMany",
        "destroy",
        "remove"
      ]
    }
  }
}
```

## Remediation

### Implement Soft Delete

```typescript
// Base model with soft delete
abstract class BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  async softDelete() {
    this.deletedAt = new Date();
    await this.save();

    auditLog.info('Record soft deleted', {
      model: this.constructor.name,
      id: this.id,
      deletedAt: this.deletedAt
    });
  }
}

// Query scope for active records
function activeRecords<T>(query: Query<T>): Query<T> {
  return query.where({ deletedAt: null });
}
```

### Data Retention Service

```typescript
// services/retention.ts
export class RetentionService {
  private readonly RETENTION_YEARS = 6;

  async enforceRetention() {
    const cutoffDate = subYears(new Date(), this.RETENTION_YEARS);

    // Find records eligible for permanent deletion
    const records = await db.patients.findMany({
      where: {
        deletedAt: { lt: cutoffDate },
        permanentlyDeleted: false
      }
    });

    for (const record of records) {
      await this.securelyDelete(record);
    }

    return { deletedCount: records.length };
  }

  private async securelyDelete(record: Patient) {
    // Log before deletion
    await auditLog.info('Permanent deletion', {
      recordId: record.id,
      originalDeletedAt: record.deletedAt,
      retentionYears: this.RETENTION_YEARS
    });

    // Secure erase sensitive fields
    await db.$executeRaw`
      UPDATE patients
      SET ssn = NULL,
          medical_history = NULL,
          permanently_deleted = true,
          erased_at = NOW()
      WHERE id = ${record.id}
    `;
  }
}
```

### Retention Policy Documentation

```typescript
// retention-policy.ts

/**
 * Data Retention Policy
 *
 * Per HIPAA §164.530(j), we retain PHI for a minimum of 6 years.
 *
 * Retention Schedule:
 * - Patient Records: 6 years from last activity
 * - Medical Records: 6 years from creation
 * - Audit Logs: 6 years from event
 * - Backups: 6 years from creation
 *
 * Deletion Process:
 * 1. Records are soft-deleted (marked deletedAt)
 * 2. After retention period, records are permanently erased
 * 3. All deletions are logged in audit trail
 */

export const RETENTION_POLICY = {
  patientRecords: { years: 6, basis: 'lastActivity' },
  medicalRecords: { years: 6, basis: 'creation' },
  auditLogs: { years: 6, basis: 'eventDate' },
  backups: { years: 6, basis: 'creation' },

  // Some states require longer retention
  stateOverrides: {
    'CA': { minors: { years: 7, afterAge: 18 } },
    'NY': { medicalRecords: { years: 6 } }
  }
} as const;
```

### Database Migration for Soft Delete

```typescript
// migrations/add-soft-delete.ts
export async function up(db: Database) {
  await db.schema.alterTable('patients', (table) => {
    table.timestamp('deleted_at').nullable();
    table.timestamp('erased_at').nullable();
    table.boolean('permanently_deleted').defaultTo(false);
  });

  // Add index for soft delete queries
  await db.schema.raw(`
    CREATE INDEX idx_patients_deleted_at
    ON patients(deleted_at)
    WHERE deleted_at IS NOT NULL
  `);
}
```

## See Also

- [HIPAA Security Rule](../hipaa/security-rule) - Disposal requirements
- [Audit Logging](./audit) - Logging deletions
