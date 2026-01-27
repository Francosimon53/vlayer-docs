---
sidebar_position: 3
title: Privacy Rule
---

# HIPAA Privacy Rule

The Privacy Rule establishes standards for the use and disclosure of Protected Health Information (PHI) and gives patients rights over their health information.

## Overview

The Privacy Rule:

- Defines what constitutes PHI
- Limits how PHI can be used and disclosed
- Gives patients rights to access and amend their records
- Requires minimum necessary use of PHI

## Protected Health Information

### Definition

PHI is any individually identifiable health information that is:
- Created or received by a covered entity
- Relates to past, present, or future health condition
- Identifies or could identify the individual

### The 18 Identifiers

Under §164.514(b)(2), the following identifiers must be removed for de-identification:

| # | Identifier | Example |
|---|------------|---------|
| 1 | Names | John Smith |
| 2 | Geographic data | Street address, city (except state) |
| 3 | Dates | Birth date, admission date |
| 4 | Phone numbers | (555) 123-4567 |
| 5 | Fax numbers | (555) 123-4568 |
| 6 | Email addresses | patient@email.com |
| 7 | Social Security numbers | 123-45-6789 |
| 8 | Medical record numbers | MRN12345678 |
| 9 | Health plan numbers | Policy #ABC123 |
| 10 | Account numbers | Acct #12345 |
| 11 | Certificate/license numbers | DL #A1234567 |
| 12 | Vehicle identifiers | License plate, VIN |
| 13 | Device identifiers | Serial numbers |
| 14 | URLs | http://patient-portal.example.com |
| 15 | IP addresses | 192.168.1.100 |
| 16 | Biometric identifiers | Fingerprint, voiceprint |
| 17 | Full-face photos | Profile pictures |
| 18 | Other unique numbers | Any other unique identifier |

**vlayer detects:** SSN, MRN, DOB, NPI, and custom patterns in code.

## Permitted Uses and Disclosures

### §164.506 - Treatment, Payment, Operations (TPO)

PHI may be used without authorization for:
- **Treatment**: Providing healthcare
- **Payment**: Billing and collections
- **Operations**: Quality improvement, training

### §164.508 - Uses Requiring Authorization

Authorization required for:
- Marketing
- Sale of PHI
- Psychotherapy notes
- Research (with some exceptions)

### §164.510 - Uses for Facility Directory

Limited information for facility directories with patient opportunity to object.

### §164.512 - Uses Without Authorization

Specific situations allowing disclosure without authorization:
- Required by law
- Public health activities
- Abuse, neglect, domestic violence
- Health oversight activities
- Judicial proceedings
- Law enforcement
- Research (with IRB approval)

## Minimum Necessary Standard

### §164.502(b) - Minimum Necessary

> A covered entity must make reasonable efforts to limit protected health information to the minimum necessary to accomplish the intended purpose.

**Implementation in code:**

```typescript
// ❌ Bad: Returns all patient data
async function getPatient(id: string) {
  return await db.patients.findById(id);
}

// ✓ Good: Returns only necessary fields
async function getPatientForBilling(id: string) {
  return await db.patients.findById(id, {
    select: ['id', 'name', 'insuranceInfo']
    // Excludes: ssn, medicalHistory, etc.
  });
}
```

### Role-Based Access

```typescript
const fieldsByRole = {
  receptionist: ['name', 'phone', 'appointmentTime'],
  nurse: ['name', 'vitals', 'medications', 'allergies'],
  doctor: ['name', 'fullMedicalHistory', 'diagnoses'],
  billing: ['name', 'insuranceInfo', 'charges']
};

function getPatientData(patient: Patient, userRole: string) {
  const allowedFields = fieldsByRole[userRole];
  return pick(patient, allowedFields);
}
```

## Patient Rights

### §164.524 - Access to PHI

Patients have the right to:
- Access their PHI
- Receive a copy in requested format
- Response within 30 days

### §164.526 - Amendment of PHI

Patients can:
- Request amendments to their PHI
- Receive response within 60 days
- Have denials explained

### §164.528 - Accounting of Disclosures

Patients can request an accounting of:
- Who received their PHI
- When it was disclosed
- For what purpose

**Implementation:**

```typescript
// Track all PHI disclosures
async function disclosePHI(params: {
  patientId: string;
  recipientId: string;
  purpose: string;
  data: string[];
}) {
  // Log the disclosure
  await db.disclosureLog.create({
    patientId: params.patientId,
    recipientId: params.recipientId,
    recipientName: await getRecipientName(params.recipientId),
    purpose: params.purpose,
    dataDisclosed: params.data,
    disclosedAt: new Date(),
    disclosedBy: getCurrentUser()
  });

  // Perform the disclosure
  return await sendToRecipient(params);
}
```

## De-identification

### §164.514(a) - De-identification Standard

De-identified data is not PHI and can be used freely.

### Methods of De-identification

#### Expert Determination (§164.514(b)(1))

A qualified expert determines the risk of identification is very small.

#### Safe Harbor (§164.514(b)(2))

Remove all 18 identifiers and have no actual knowledge the information can identify an individual.

**vlayer helps by:** Detecting PHI identifiers that should be removed for de-identification.

## Business Associates

### §164.504(e) - Business Associate Agreements

Required when sharing PHI with business associates. Must include:
- Permitted uses and disclosures
- Safeguards requirements
- Breach notification obligations
- Subcontractor requirements

## Breach Notification

### §164.404 - Notification to Individuals

- Within 60 days of discovery
- Written notice to affected individuals
- Content requirements (description, types of PHI, steps to protect)

### §164.406 - Notification to Media

If breach affects 500+ residents of a state, notify prominent media outlets.

### §164.408 - Notification to Secretary

- Breaches of 500+ individuals: within 60 days
- Smaller breaches: annual log submission

## vlayer and Privacy Rule

| Requirement | How vlayer Helps |
|-------------|------------------|
| PHI Identification | Detects PHI in code |
| Minimum Necessary | Identifies over-broad queries |
| Access Logging | Verifies audit logging |
| De-identification | Finds identifiers to remove |

## See Also

- [Security Rule](./security-rule) - Technical safeguards
- [PHI Scanner](../scanners/phi) - Detecting PHI in code
- [Audit Scanner](../scanners/audit) - Logging requirements
