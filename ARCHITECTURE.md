# EquipTrack v0.2 – Enterprise Architecture & Implementation Directive

## Mission

Refactor EquipTrack from a proof-of-concept into a secure, scalable, enterprise-grade asset lifecycle management platform.

This phase is focused on strengthening the platform architecture, improving security, enabling concurrent multi-user operation, and establishing a modular foundation capable of supporting future expansion.

Every implementation decision should prioritize maintainability, scalability, security, and clean separation of concerns.

---

# Core Engineering Principles

The application should be designed as a layered architecture.

```
Next.js UI
      │
      ▼
Presentation Layer
      │
      ▼
API Routes / Server Actions
      │
      ▼
Business Logic Layer
      │
      ▼
Authorization Layer
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
```

Business logic must never exist inside UI components.

Database access must never occur directly from frontend components.

Every write operation must pass through validation, authorization, and audit logging.

---

# Architecture Decision Record (ADR)

All architectural work must align with the following permanent design decisions.

## ADR-001 — Database

**Decision:** PostgreSQL

**Reason:**
SQLite is appropriate for development but does not adequately support the concurrency and operational requirements of a multi-user enterprise application.

PostgreSQL becomes the permanent production database.

Requirements:

* Preserve schema integrity
* Regenerate Prisma migrations
* Validate indexes
* Validate foreign keys
* Validate constraints
* Optimize for concurrent users

Existing mock data does not need to be migrated.

---

## ADR-002 — ORM

Prisma remains the single data access layer.

No direct SQL should exist inside UI components.

Business services interact only with Prisma.

---

## ADR-003 — Identity & Access Management

EquipTrack shall implement a layered Identity and Access Management (IAM) architecture.

Authentication and Authorization are independent systems.

Authentication answers:

> Who is this user?

Authorization answers:

> What may this user do?

These responsibilities must never be combined.

Architecture:

```
User
      │
      ▼
Identity Provider
(Auth.js)
      │
      ▼
Authentication
      │
      ▼
Session
      │
      ▼
Authorization Middleware
      │
      ▼
Business Services
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
```

---

# Authentication (AuthN)

Authentication shall be implemented using **Auth.js**.

The authentication layer must remain provider-agnostic.

Supported providers:

* Local Credentials (Development)
* Microsoft Entra ID (Preferred Enterprise)
* Google (Optional)
* GitHub (Developer Access)

Application code must never depend upon which provider authenticated the user.

Authentication should expose:

* User ID
* Name
* Email
* Session
* Provider

Passwords must never be stored by EquipTrack when using external identity providers.

---

# Authorization (AuthZ)

Authorization must be implemented independently from authentication.

Permissions should be database-driven.

Never hardcode role names throughout the application.

Recommended schema:

```
Users

↓

Roles

↓

Permissions

↓

RolePermissions
```

Example permissions:

```
equipment.read
equipment.create
equipment.update
equipment.delete

employee.read
employee.update

repair.read
repair.create
repair.update
repair.close

reports.view

admin.users.manage
admin.roles.manage
system.settings.manage
```

Roles become permission collections.

Suggested default roles:

Viewer

Operator

Supervisor

Administrator

Future roles should be addable without modifying application code.

---

# Middleware

Every protected route must pass through centralized middleware.

Middleware responsibilities:

* Verify authentication
* Verify active account
* Load permissions
* Evaluate authorization
* Reject unauthorized requests

Authorization logic should never be duplicated inside pages or components.

---

# User Model

Extend the Users table.

Suggested fields:

* id
* email
* displayName
* provider
* roleId
* active
* lastLogin
* createdAt
* updatedAt

Future-ready fields:

* department
* facility
* employeeNumber

---

# Database Migration

Replace SQLite with PostgreSQL.

Requirements:

* Update Prisma provider
* Update DATABASE_URL
* Regenerate migrations
* Verify all relationships
* Validate foreign keys
* Optimize indexes

All schema changes should be migration-driven.

---

# Concurrency

EquipTrack shall safely support multiple concurrent users.

Review all workflows for race conditions.

Critical workflows include:

* Equipment assignment
* Equipment return
* Bulk updates
* Tag Out
* Repair completion
* Employee management

Use Prisma transactions where appropriate.

Prevent partial writes.

Guarantee atomic operations.

---

# Validation Layer

Validation occurs on the server.

Never trust client-side validation.

Validate:

* Required fields
* Duplicate assets
* Duplicate serial numbers
* Invalid employee assignments
* Invalid equipment states
* Invalid lifecycle transitions

---

# Audit Logging

Every important event must generate an immutable audit record.

Capture:

* User
* Timestamp
* Entity
* Action
* Previous Value
* New Value
* Session
* IP (optional)
* Notes

Track events including:

* Login
* Logout
* Failed Login
* Create
* Update
* Delete
* Assignment
* Return
* Tag Out
* Repair Completion
* Role Changes
* Permission Changes

---

# Equipment Lifecycle

Replace simple status values with a lifecycle model.

Suggested lifecycle:

```
Available

↓

Assigned

↓

Returned

↓

Inspection

↓

Available
Maintenance
Tagged Out
```

Repair workflow:

```
Tagged Out

↓

Awaiting Repair

↓

In Repair

↓

Quality Verification

↓

Returned to Service
```

Avoid hardcoded state transitions.

Design lifecycle rules for future expansion.

---

# Tag Out Module

Create a dedicated repair workflow.

Each repair record should contain:

* Equipment
* Reporter
* Date
* Category
* Severity
* Description
* Current Status
* Assigned Technician
* Resolution
* Resolution Date

Suggested categories:

* Physical Damage
* Screen
* Battery
* Scanner
* Keyboard
* Charging
* Software
* Network
* Missing Parts
* Other

Suggested severity:

* Low
* Medium
* High
* Critical

Tagged Out equipment must automatically become unavailable for assignment.

---


# Dashboard

Expand operational visibility.

Equipment metrics:

* Available
* Assigned
* Tagged Out
* Maintenance
* Awaiting Repair

Repair metrics:

* Open Repairs
* Completed Today
* Average Repair Time

System metrics:

* Active Users
* Database Health
* API Status

---

# Search

Implement global search.

Support:

* Equipment Number
* Barcode
* Asset ID
* Serial Number
* Employee
* Department
* Repair Tickets

---

# Performance

Optimize:

* Prisma queries
* Pagination
* Indexes
* Lazy loading
* Server Components where appropriate

Minimize unnecessary client rendering.

---

# Security

Implement:

* Secure sessions
* Authorization middleware
* Route protection
* Input sanitization
* CSRF protection where applicable
* Rate limiting
* Secure cookies
* Prevention of privilege escalation

---

# Future Architecture

Design for future modules without requiring significant refactoring.

Planned capabilities include:

* RFID asset tracking
* Barcode scanning
* Mobile PWA
* Offline synchronization
* Preventive maintenance
* Scheduled inspections
* Incident management
* Analytics
* AI-powered insights
* Notifications
* Multi-site support
* Department-scoped permissions
* API keys
* Service accounts
* External integrations

---

# Implementation Standards

Every feature implementation must include:

* Database migration
* Prisma updates
* Business service implementation
* API endpoints
* UI components
* Authorization enforcement
* Validation
* Audit logging
* Error handling
* Documentation

Implement features in small, reviewable increments.

Favor readability, maintainability, and extensibility over clever or overly compact solutions.

Every architectural decision should reinforce EquipTrack's evolution into a secure, enterprise-grade internal operations platform.
