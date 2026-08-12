# OpsFlow — System Architecture

## 1. Architecture Overview

OpsFlow follows a layered full-stack architecture consisting of:

- React frontend
- Express backend API
- Authentication and authorization middleware
- Controller layer
- Service layer
- Prisma ORM
- PostgreSQL database

The frontend communicates with the backend through REST APIs.

---

## 2. High-Level Architecture

```mermaid
flowchart TD

    User["User"]

    Frontend["React Frontend<br/>TypeScript + Vite + Tailwind CSS"]

    State["Redux Toolkit<br/>Authentication State"]

    Router["React Router<br/>Protected Routes + RBAC"]

    APIClient["Axios API Client"]

    Backend["Express Backend API"]

    Auth["Authentication Middleware<br/>JWT + HTTP-only Cookie"]

    RBAC["Authorization Middleware<br/>Role-Based Access Control"]

    Validation["Validation Layer<br/>Zod"]

    Controllers["Controllers"]

    Services["Service Layer<br/>Business Logic"]

    Prisma["Prisma ORM"]

    Database[("PostgreSQL Database")]

    User --> Frontend

    Frontend --> State
    Frontend --> Router
    Frontend --> APIClient

    APIClient --> Backend

    Backend --> Auth
    Auth --> RBAC
    RBAC --> Validation
    Validation --> Controllers
    Controllers --> Services
    Services --> Prisma
    Prisma --> Database

3. Frontend Architecture

The frontend is built using React and TypeScript.

Major frontend responsibilities include:

Rendering the user interface
Managing authentication state
Handling navigation
Protecting routes
Applying frontend role-based access control
Sending API requests
Displaying API responses
Providing forms and user interactions

The main frontend structure is organized into:

frontend/src/
│
├── api/
├── app/
├── components/
├── context/
├── features/
├── pages/
├── routes/
├── types/
└── utils/
3.1 API Layer

The API layer contains functions responsible for communicating with the backend.

Axios is used to make HTTP requests.

Example responsibilities include:

Authentication API
Customer API
Product API
Challan API

The UI components do not need to directly construct backend requests everywhere because API communication is centralized in the API layer.

3.2 Authentication State

Redux Toolkit is used to maintain authentication state.

The authentication state contains information such as:

User
Authentication status
User role

This allows different parts of the application to determine the currently authenticated user's role.

3.3 Route Protection

The frontend uses protected routes to prevent unauthenticated users from accessing protected pages.

Role-protected routes additionally verify whether the authenticated user's role is allowed to access the requested page.

The frontend therefore has two levels of route protection:

Authentication
      ↓
Role Authorization
      ↓
Page
4. Backend Architecture

The backend follows a layered architecture.

Request
   ↓
Route
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL

This separation keeps routing, authorization, request handling, and business logic independent.

5. Route Layer

The route layer defines the available API endpoints.

Examples include:

/auth
/customers
/products
/challans

Routes are responsible for connecting HTTP requests to the appropriate middleware and controller.

6. Authentication Layer

Protected routes use authentication middleware.

The middleware verifies the authentication information associated with the request and identifies the authenticated user.

The authenticated user's information is then made available to subsequent middleware and controllers.

7. Authorization Layer

After authentication, role-based authorization determines whether the authenticated user is allowed to perform the requested operation.

Supported roles are:

ADMIN
SALES
WAREHOUSE
ACCOUNTS

Example:

POST /products
        ↓
Authentication
        ↓
Authorization
        ↓
ADMIN or WAREHOUSE?
        ↓
Yes → Continue
No  → Reject

Backend authorization is the primary security boundary.

8. Validation Layer

Zod is used to validate incoming request data.

Validation occurs before business logic is executed.

Examples include:

Customer data
Product data
Stock movement data
Challan data

This ensures invalid request data is rejected early.

9. Controller Layer

Controllers handle HTTP-level responsibilities.

Controllers are responsible for:

Reading request parameters
Reading request bodies
Reading authenticated user information
Calling service functions
Returning HTTP responses
Handling request-level errors

Controllers do not contain the majority of the business logic.

10. Service Layer

The service layer contains the application's business logic.

Examples include:

Customer Services
Create customer
Get customers
Get customer details
Update customer
Create follow-up
Product Services
Create product
Get products
Get product details
Update product
Stock IN
Stock OUT
Challan Services
Create challan
Get challans
Confirm challan
Cancel challan

The service layer communicates with Prisma to perform database operations.

11. Database Layer

Prisma ORM is used as the database access layer.

Prisma provides:

Type-safe database access
Database queries
Relations
Transactions
Generated database client

The application uses PostgreSQL as its database.

12. Transactional Operations

Some operations require multiple database changes to succeed together.

The most important example is challan confirmation.

Confirm Challan
       |
       v
Check Challan
       |
       v
Check Product Stock
       |
       v
Reduce Product Stock
       |
       v
Create Stock Movement
       |
       v
Update Challan Status

These operations are performed within a database transaction.

This prevents the system from ending up in an inconsistent state if one of the operations fails.

13. Inventory Architecture

Inventory does not use a separate database table.

Instead, inventory is represented through the Product and StockMovement entities.

Product
│
├── currentStock
├── minimumStock
└── location
        │
        └── StockMovement
             ├── IN
             └── OUT

The Inventory frontend page uses this existing information to provide an inventory overview.

14. Challan and Inventory Flow

The relationship between challans and inventory is:

Sales User
    |
    v
Create Draft Challan
    |
    v
Confirm Challan
    |
    v
Check Product Stock
    |
    +---- Insufficient Stock
    |          |
    |          v
    |       Reject
    |
    v
Reduce Product Stock
    |
    v
Create Stock OUT Movement
    |
    v
Mark Challan CONFIRMED

This ensures that confirmed challans are reflected in inventory.

15. Security Architecture

OpsFlow uses multiple layers of security.

                 Request
                    |
                    v
              Authentication
                    |
                    v
              Authorization
                    |
                    v
                Validation
                    |
                    v
              Business Logic
                    |
                    v
                 Database
Frontend

The frontend:

Hides unauthorized navigation items
Hides unauthorized actions
Protects routes
Displays role-specific functionality
Backend

The backend:

Authenticates requests
Verifies user roles
Validates request data
Enforces business rules

Frontend authorization improves the user experience, while backend authorization prevents unauthorized API access.

16. Module Interaction

The major modules interact as follows:

                    ┌─────────────┐
                    │   Customer  │
                    └──────┬──────┘
                           │
                           v
                    ┌─────────────┐
                    │   Challan   │
                    └──────┬──────┘
                           │
                           v
                    ┌─────────────┐
                    │   Product   │
                    └──────┬──────┘
                           │
                           v
                    ┌─────────────┐
                    │  Inventory  │
                    └──────┬──────┘
                           │
                           v
                    ┌─────────────┐
                    │StockMovement│
                    └─────────────┘

A customer can have multiple challans.

A challan contains multiple products through challan items.

Confirming a challan results in stock OUT movements for the associated products.

17. Deployment Architecture

The application can be deployed using the following architecture:

                 Internet
                    |
                    v
            React Frontend
                    |
                    v
             Express Backend
                    |
                    v
              Prisma ORM
                    |
                    v
             PostgreSQL

The frontend and backend can be deployed independently, while the backend connects to the PostgreSQL database through Prisma.

18. Architecture Principles

The architecture follows several important principles:

Separation of Concerns

Each layer has a specific responsibility.

Centralized Business Logic

Business rules are implemented in the service layer rather than duplicated across controllers.

Defense in Depth

Authorization exists at both the frontend and backend levels.

Type Safety

TypeScript and Prisma provide type safety across the application.

Validation

Zod validates incoming API data.

Transaction Safety

Operations requiring multiple related database changes use transactions.

Reusable Data Model

Inventory functionality reuses Product and StockMovement instead of introducing unnecessary duplicate data structures.