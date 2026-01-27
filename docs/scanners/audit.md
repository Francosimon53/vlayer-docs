---
sidebar_position: 4
title: Audit Logging
---

# Audit Logging Scanner

The Audit scanner verifies that your application properly logs access to protected health information (PHI), meeting HIPAA audit trail requirements.

## HIPAA Reference

**§164.312(b) - Audit controls**

> Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.

## What It Detects

### Missing Logging Framework

```typescript
// ❌ MEDIUM: No logging detected in PHI operations
async function getPatient(id: string) {
  return await db.patients.findById(id);
}

// ✓ Proper logging
import logger from './logger';

async function getPatient(id: string, userId: string) {
  logger.info('PHI access', {
    action: 'read',
    resource: 'patient',
    resourceId: id,
    userId,
    timestamp: new Date().toISOString()
  });
  return await db.patients.findById(id);
}
```

### Unlogged PHI Operations

```typescript
// ❌ HIGH: PHI modification without logging
async function updatePatient(id: string, data: PatientData) {
  await db.patients.update(id, data);
}

// ✓ Logged modification
async function updatePatient(id: string, data: PatientData, userId: string) {
  const before = await db.patients.findById(id);
  await db.patients.update(id, data);

  logger.info('PHI modification', {
    action: 'update',
    resource: 'patient',
    resourceId: id,
    userId,
    changes: diff(before, data),
    timestamp: new Date().toISOString()
  });
}
```

### Missing User Context

```typescript
// ❌ MEDIUM: Log missing user identification
logger.info('Patient record accessed');

// ✓ Complete audit log
logger.info('Patient record accessed', {
  userId: req.user.id,
  sessionId: req.session.id,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Sensitive Data in Logs

```typescript
// ❌ CRITICAL: PHI in logs
logger.info('Patient data:', { ssn: patient.ssn, diagnosis: patient.diagnosis });

// ✓ Safe: Reference only
logger.info('Patient accessed', { patientId: patient.id });
```

## Detection Rules

| Issue | Severity | Description |
|-------|----------|-------------|
| No logging framework | MEDIUM | No logger import found |
| Unlogged PHI read | MEDIUM | Database read without logging |
| Unlogged PHI write | HIGH | Database write without logging |
| Missing user context | MEDIUM | Log without user identification |
| PHI in logs | CRITICAL | Sensitive data logged directly |
| No timestamp | LOW | Logs missing timestamps |

## Required Audit Fields

HIPAA requires audit logs to capture:

| Field | Description | Example |
|-------|-------------|---------|
| User ID | Who performed the action | `user-123` |
| Action | What was done | `read`, `create`, `update`, `delete` |
| Resource | What was accessed | `patient`, `prescription` |
| Resource ID | Specific record | `patient-456` |
| Timestamp | When it occurred | `2024-01-15T10:30:00Z` |
| Outcome | Success/failure | `success`, `denied` |

## Configuration

```json
{
  "scanners": {
    "audit": {
      "loggers": ["winston", "pino", "bunyan", "log4js"],
      "phiOperations": [
        "findById",
        "findOne",
        "find",
        "create",
        "update",
        "delete"
      ],
      "requiredFields": [
        "userId",
        "action",
        "resource",
        "timestamp"
      ]
    }
  }
}
```

## Remediation

### Set Up Audit Logger

```typescript
// auditLogger.ts
import winston from 'winston';

export const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'healthcare-app' },
  transports: [
    new winston.transports.File({
      filename: 'audit.log',
      level: 'info'
    })
  ]
});

export function logPHIAccess(params: {
  userId: string;
  action: 'read' | 'create' | 'update' | 'delete';
  resource: string;
  resourceId: string;
  outcome: 'success' | 'denied' | 'error';
  metadata?: Record<string, unknown>;
}) {
  auditLogger.info('PHI access', {
    ...params,
    timestamp: new Date().toISOString()
  });
}
```

### Create Audit Middleware

```typescript
// auditMiddleware.ts
import { logPHIAccess } from './auditLogger';

export function auditMiddleware(resourceType: string) {
  return (req, res, next) => {
    const originalJson = res.json;

    res.json = function(data) {
      logPHIAccess({
        userId: req.user?.id || 'anonymous',
        action: methodToAction(req.method),
        resource: resourceType,
        resourceId: req.params.id || 'multiple',
        outcome: res.statusCode < 400 ? 'success' : 'error'
      });

      return originalJson.call(this, data);
    };

    next();
  };
}

// Usage
app.use('/api/patients', auditMiddleware('patient'), patientRoutes);
```

### Repository Pattern with Logging

```typescript
class AuditedPatientRepository {
  constructor(
    private db: Database,
    private audit: AuditLogger
  ) {}

  async findById(id: string, context: RequestContext): Promise<Patient> {
    const patient = await this.db.patients.findById(id);

    this.audit.log({
      userId: context.userId,
      action: 'read',
      resource: 'patient',
      resourceId: id,
      outcome: patient ? 'success' : 'not_found'
    });

    return patient;
  }

  async update(id: string, data: Partial<Patient>, context: RequestContext) {
    const result = await this.db.patients.update(id, data);

    this.audit.log({
      userId: context.userId,
      action: 'update',
      resource: 'patient',
      resourceId: id,
      outcome: 'success',
      metadata: { fieldsChanged: Object.keys(data) }
    });

    return result;
  }
}
```

## See Also

- [HIPAA Security Rule](../hipaa/security-rule) - Audit requirements
- [Access Control](./access) - Who accessed what
