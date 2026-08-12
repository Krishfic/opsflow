# Customer Module

## Overview

The Customer module provides functionality for managing customer records in OpsFlow.

The module supports:

- Customer listing
- Search
- Status filtering
- Pagination
- Customer creation
- Customer editing
- Customer details
- Follow-up history
- Adding follow-ups

Customer data is persisted in PostgreSQL through Prisma.

---

# Customer Data Model

The primary customer entity is `Customer`.

A customer can have multiple follow-up records.

```mermaid
erDiagram

    USER ||--o{ CUSTOMER_FOLLOW_UP : creates

    CUSTOMER ||--o{ CUSTOMER_FOLLOW_UP : has

    CUSTOMER {
        int id PK
        string name
        string mobile
        string email
        string businessName
        string gstNumber
        CustomerType customerType
        string address
        CustomerStatus status
        datetime followUpDate
        string notes
        datetime createdAt
        datetime updatedAt
    }

    CUSTOMER_FOLLOW_UP {
        int id PK
        int customerId FK
        int createdById FK
        string note
        datetime followUpDate
        datetime createdAt
    }

    USER {
        int id PK
        string name
        string email
        Role role
    }

Customer Status

Customers can have one of three statuses:

Lead
Active
Inactive

These statuses are used by the Customer List filtering functionality.

Customer Types

Customers can be classified as:

Retail
Wholesale
Distributor

Frontend Architecture

flowchart TD

    A[Customers Page] --> B[Customer API Layer]

    B --> C[Axios]

    C --> D[Express API]

    D --> E[Authentication Middleware]

    E --> F[Authorization Middleware]

    F --> G[Customer Controller]

    G --> H[Customer Service]

    H --> I[Prisma]

    I --> J[(PostgreSQL)]

Customer List Flow

sequenceDiagram

    participant U as User
    participant R as React
    participant A as Axios
    participant C as Customer Controller
    participant S as Customer Service
    participant P as Prisma
    participant DB as PostgreSQL

    U->>R: Open Customers
    R->>A: GET /api/customers
    A->>C: Request
    C->>S: Get customers
    S->>P: findMany()
    P->>DB: Query customers
    DB-->>P: Customer records
    P-->>S: Customers + total
    S-->>C: Result
    C-->>A: JSON response
    A-->>R: Customer data
    R-->>U: Render customer table

Search and Filtering

The Customer List supports:

Search by name
Search by mobile
Search by business name
Status filtering
Pagination

Search and filtering parameters are sent to the backend.

Create Customer Flow

sequenceDiagram

    participant U as User
    participant R as Customer Form
    participant A as Axios
    participant C as Controller
    participant S as Service
    participant P as Prisma
    participant DB as PostgreSQL

    U->>R: Submit customer form
    R->>A: POST /api/customers
    A->>C: Create customer request
    C->>C: Validate request
    C->>S: Create customer
    S->>P: customer.create()
    P->>DB: INSERT customer
    DB-->>P: Created customer
    P-->>S: Customer
    S-->>C: Customer
    C-->>A: 201 Created
    A-->>R: Success
    R-->>U: Return to customer list

Edit Customer Flow

flowchart TD

    A[Customer Details] --> B[Edit Customer]

    B --> C[Customer Form]

    C --> D[PATCH /api/customers/:id]

    D --> E[Controller]

    E --> F[Customer Service]

    F --> G[Prisma]

    G --> H[(PostgreSQL)]

    H --> I[Updated Customer]

    I --> J[Return to Customer List]

Follow-up Architecture

A customer can have multiple follow-up records.

Each follow-up stores:

Customer
User who created the follow-up
Follow-up note
Scheduled follow-up date
Record creation timestamp

Follow-up History Flow

sequenceDiagram

    participant U as User
    participant R as React
    participant A as Axios
    participant C as Controller
    participant S as Service
    participant P as Prisma
    participant DB as PostgreSQL

    U->>R: Open customer details

    R->>A: GET /api/customers/:id/follow-ups

    A->>C: Request

    C->>S: Get follow-ups

    S->>P: findMany()

    P->>DB: Query follow-ups

    DB-->>P: Follow-up records

    P-->>S: Follow-ups ordered by createdAt

    S-->>C: Follow-up history

    C-->>A: JSON response

    A-->>R: Follow-up data

    R-->>U: Render timeline

Add Follow-up Flow

flowchart TD

    A[Customer Details] --> B[Add Follow-up Form]

    B --> C[POST /api/customers/:id/follow-ups]

    C --> D[Authentication]

    D --> E[Authorization]

    E --> F[Validation]

    F --> G[Customer Service]

    G --> H[Prisma]

    H --> I[(PostgreSQL)]

    I --> J[Follow-up Created]

    J --> K[Reload Follow-up History]

    K --> L[Updated Timeline]

Authentication and Authorization

Customer APIs are protected by authentication middleware.

Role-based authorization is applied where required.

The frontend also uses role-aware navigation to prevent users from seeing functionality that is not relevant to their role.

Frontend restrictions are considered a UX layer.

Backend authorization remains the actual security boundary.

Error Handling

The Customer module handles:

Invalid customer IDs
Authentication failures
Authorization failures
Validation errors
Database/API failures
Empty customer results
Empty follow-up history

The frontend displays appropriate loading, empty and error states.