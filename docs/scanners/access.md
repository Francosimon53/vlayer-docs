---
sidebar_position: 5
title: Access Control
---

# Access Control Scanner

The Access Control scanner identifies authentication vulnerabilities, authorization bypasses, and permission issues that could allow unauthorized access to PHI.

## HIPAA Reference

**§164.312(a)(1) - Access control**

> Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights.

**§164.312(d) - Person or entity authentication**

> Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.

## What It Detects

### Missing Authentication

```typescript
// ❌ CRITICAL: No authentication on PHI endpoint
app.get('/api/patients/:id', async (req, res) => {
  const patient = await db.patients.findById(req.params.id);
  res.json(patient);
});

// ✓ Protected endpoint
app.get('/api/patients/:id', authenticate, async (req, res) => {
  const patient = await db.patients.findById(req.params.id);
  res.json(patient);
});
```

### Hardcoded Credentials

```typescript
// ❌ CRITICAL: Hardcoded credentials
const dbPassword = "super_secret_123";
const apiKey = "sk_live_abc123xyz";

// ✓ Environment variables
const dbPassword = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;
```

### Overly Permissive CORS

```typescript
// ❌ HIGH: Allows any origin
app.use(cors({ origin: '*' }));

// ❌ MEDIUM: Reflects origin without validation
app.use(cors({ origin: true }));

// ✓ Explicit allowed origins
app.use(cors({
  origin: ['https://app.healthcare.com', 'https://admin.healthcare.com']
}));
```

### Hardcoded Roles/Permissions

```typescript
// ❌ MEDIUM: Hardcoded role check
if (user.email === 'admin@company.com') {
  // Grant admin access
}

// ✓ Role-based check
if (user.roles.includes('admin')) {
  // Grant admin access
}
```

### Missing Authorization

```typescript
// ❌ HIGH: No ownership check
app.get('/api/patients/:id/records', authenticate, async (req, res) => {
  const records = await db.records.find({ patientId: req.params.id });
  res.json(records);
});

// ✓ With authorization
app.get('/api/patients/:id/records', authenticate, authorize, async (req, res) => {
  // authorize middleware checks if user can access this patient
  const records = await db.records.find({ patientId: req.params.id });
  res.json(records);
});
```

### Insecure Session Management

```typescript
// ❌ MEDIUM: Session stored in localStorage
localStorage.setItem('authToken', token);

// ✓ HttpOnly cookie
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

## Detection Rules

| Issue | Severity | Description |
|-------|----------|-------------|
| Unprotected PHI endpoint | CRITICAL | No auth middleware on PHI routes |
| Hardcoded credentials | CRITICAL | Secrets in source code |
| `cors({ origin: '*' })` | HIGH | Any origin allowed |
| Missing authorization | HIGH | Auth without authz |
| Hardcoded role checks | MEDIUM | Email/name-based permissions |
| localStorage auth | MEDIUM | Token in localStorage |
| Disabled auth check | HIGH | `// TODO: add auth` patterns |

## Configuration

```json
{
  "scanners": {
    "access": {
      "authMiddleware": ["authenticate", "requireAuth", "isAuthenticated"],
      "authzMiddleware": ["authorize", "checkPermission", "requireRole"],
      "protectedPaths": [
        "/api/patients",
        "/api/records",
        "/api/prescriptions"
      ],
      "allowedCorsOrigins": [
        "https://app.healthcare.com"
      ]
    }
  }
}
```

## Remediation

### Implement Authentication Middleware

```typescript
// middleware/authenticate.ts
import jwt from 'jsonwebtoken';

export async function authenticate(req, res, next) {
  const token = req.cookies.session || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await db.users.findById(payload.userId);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Add Authorization Layer

```typescript
// middleware/authorize.ts
export function authorize(permission: string) {
  return async (req, res, next) => {
    const user = req.user;
    const resource = req.params.id;

    const allowed = await checkPermission(user, permission, resource);

    if (!allowed) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
}

// Usage
app.get('/api/patients/:id',
  authenticate,
  authorize('patient:read'),
  getPatient
);
```

### Secure Credential Management

```typescript
// Use environment variables
const config = {
  database: {
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET
  }
};

// Validate required secrets at startup
const required = ['DB_PASSWORD', 'JWT_SECRET', 'ENCRYPTION_KEY'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

### Configure CORS Properly

```typescript
import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### Role-Based Access Control

```typescript
// Define permissions
const permissions = {
  'patient:read': ['doctor', 'nurse', 'admin'],
  'patient:write': ['doctor', 'admin'],
  'patient:delete': ['admin'],
  'prescription:create': ['doctor']
};

function checkPermission(user: User, permission: string): boolean {
  const allowedRoles = permissions[permission] || [];
  return user.roles.some(role => allowedRoles.includes(role));
}
```

## See Also

- [HIPAA Security Rule](../hipaa/security-rule) - Access control requirements
- [Audit Logging](./audit) - Log access attempts
