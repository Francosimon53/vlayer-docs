---
sidebar_position: 2
title: Security Rule
---

# HIPAA Security Rule

The Security Rule establishes standards for protecting electronic protected health information (ePHI) through administrative, physical, and technical safeguards.

## Overview

The Security Rule requires covered entities and business associates to:

1. Ensure confidentiality, integrity, and availability of ePHI
2. Protect against anticipated threats
3. Protect against impermissible uses or disclosures
4. Ensure workforce compliance

## Technical Safeguards

### §164.312(a)(1) - Access Control

> Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights.

**vlayer checks:**
- Authentication middleware on PHI endpoints
- Role-based access controls
- No hardcoded credentials

**Implementation:**
```typescript
// Required: Authentication
app.use('/api/patients', authenticate);

// Required: Authorization
app.use('/api/patients', authorize('patient:read'));
```

### §164.312(a)(2)(i) - Unique User Identification

> Assign a unique name and/or number for identifying and tracking user identity.

**Implementation:**
- Unique user IDs for all system users
- No shared accounts
- User identity in all transactions

### §164.312(a)(2)(ii) - Emergency Access Procedure

> Establish procedures for obtaining necessary ePHI during an emergency.

**Implementation:**
- Break-glass procedures
- Emergency access logging
- Post-emergency review process

### §164.312(a)(2)(iii) - Automatic Logoff

> Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.

**Implementation:**
```typescript
// Session timeout (15 minutes recommended)
app.use(session({
  cookie: { maxAge: 15 * 60 * 1000 },
  rolling: true
}));
```

### §164.312(a)(2)(iv) - Encryption and Decryption

> Implement a mechanism to encrypt and decrypt electronic protected health information.

**vlayer checks:**
- Strong encryption algorithms (AES-256)
- No weak hashing (MD5, SHA-1)
- HTTPS enforcement

**Implementation:**
```typescript
// Required: Strong encryption
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

// Required: HTTPS
app.use((req, res, next) => {
  if (!req.secure) return res.redirect(`https://${req.headers.host}${req.url}`);
  next();
});
```

### §164.312(b) - Audit Controls

> Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.

**vlayer checks:**
- Logging framework present
- PHI access logged
- User context in logs

**Required log fields:**
- User ID
- Action performed
- Resource accessed
- Timestamp
- Outcome (success/failure)

### §164.312(c)(1) - Integrity

> Implement policies and procedures to protect electronic protected health information from improper alteration or destruction.

**Implementation:**
- Data validation
- Checksums/signatures
- Change tracking

### §164.312(c)(2) - Mechanism to Authenticate ePHI

> Implement electronic mechanisms to corroborate that electronic protected health information has not been altered or destroyed in an unauthorized manner.

**Implementation:**
```typescript
// Hash verification for data integrity
const hash = crypto.createHash('sha256').update(data).digest('hex');
```

### §164.312(d) - Person or Entity Authentication

> Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.

**vlayer checks:**
- Authentication on all PHI endpoints
- No authentication bypasses
- Secure session management

### §164.312(e)(1) - Transmission Security

> Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.

**vlayer checks:**
- HTTPS/TLS enforcement
- No HTTP for PHI
- TLS 1.2+ required

### §164.312(e)(2)(i) - Integrity Controls

> Implement security measures to ensure that electronically transmitted electronic protected health information is not improperly modified without detection.

**Implementation:**
- Message authentication codes
- Digital signatures
- TLS with integrity verification

### §164.312(e)(2)(ii) - Encryption

> Implement a mechanism to encrypt electronic protected health information whenever deemed appropriate.

**Requirement:** Encrypt ePHI in transit and at rest.

## Administrative Safeguards

### §164.308(a)(1) - Security Management Process

- Risk analysis
- Risk management
- Sanction policy
- Information system activity review

### §164.308(a)(3) - Workforce Security

- Authorization procedures
- Workforce clearance
- Termination procedures

### §164.308(a)(4) - Information Access Management

- Access authorization
- Access establishment and modification

### §164.308(a)(5) - Security Awareness and Training

- Security reminders
- Protection from malicious software
- Log-in monitoring
- Password management

### §164.308(a)(6) - Security Incident Procedures

- Response and reporting

### §164.308(a)(7) - Contingency Plan

- Data backup plan
- Disaster recovery plan
- Emergency mode operation plan
- Testing and revision procedures
- Applications and data criticality analysis

### §164.308(a)(8) - Evaluation

- Periodic technical and non-technical evaluation

## Physical Safeguards

### §164.310(a)(1) - Facility Access Controls

- Contingency operations
- Facility security plan
- Access control and validation procedures
- Maintenance records

### §164.310(b) - Workstation Use

- Policies for proper workstation use

### §164.310(c) - Workstation Security

- Physical safeguards for workstations

### §164.310(d)(1) - Device and Media Controls

- Disposal
- Media re-use
- Accountability
- Data backup and storage

## vlayer Coverage

| Safeguard | Requirement | vlayer Scanner |
|-----------|-------------|----------------|
| Technical | Access Control | ✅ Access |
| Technical | Audit Controls | ✅ Audit |
| Technical | Integrity | ✅ Encryption |
| Technical | Transmission Security | ✅ Encryption |
| Technical | Authentication | ✅ Access |
| Administrative | Risk Analysis | Partial (findings report) |
| Physical | - | Not applicable to code |

## See Also

- [Privacy Rule](./privacy-rule) - PHI use and disclosure
- [Scanners](../scanners/) - How vlayer implements these checks
