# OpsFlow

A role-based operations management system for managing customers, products, inventory, stock movements, and delivery challans.

---

## Overview

OpsFlow is a full-stack web application designed to centralize day-to-day operational activities for a business.

The application provides different capabilities based on the user's role and includes:

- Customer management
- Customer follow-ups
- Product management
- Inventory monitoring
- Stock IN and OUT operations
- Stock movement history
- Delivery challan management
- Role-based access control
- Authentication and protected routes

The system implements authorization at both the frontend and backend levels.

---

# Features

## Authentication

- User login
- User logout
- Current authenticated user
- JWT-based authentication
- HTTP-only cookie-based session handling
- Protected frontend routes

---

## Customer Management

- Customer listing
- Customer search
- Customer status filtering
- Pagination
- Customer creation
- Customer editing
- Customer details
- Customer follow-ups
- Follow-up history

Supported customer types:

- RETAIL
- WHOLESALE
- DISTRIBUTOR

Supported customer statuses:

- LEAD
- ACTIVE
- INACTIVE

---

## Product Management

- Product listing
- Product search
- Category filtering through search
- Low-stock filtering
- Product details
- Product creation
- Product editing
- Stock movement history

Product information includes:

- Product name
- SKU
- Category
- Unit price
- Current stock
- Minimum stock
- Location

---

## Inventory Management

The Inventory module provides a centralized overview of current stock.

It displays:

- Total products
- Total units
- Low-stock products
- Current stock
- Minimum stock
- Product location
- Inventory status

Inventory uses the product stock information and does not maintain a duplicate inventory data model.

---

## Stock Management

Authorized users can perform:

### Stock IN

Adds inventory to a product and records an `IN` stock movement.

### Stock OUT

Removes inventory from a product and records an `OUT` stock movement.

The system prevents stock from becoming negative.

Every movement records:

- Product
- Quantity
- Movement type
- Reason
- User
- Timestamp

---

## Challan Management

The challan module supports:

- Challan creation
- Draft challans
- Challan listing
- Challan search
- Challan status filtering
- Challan details
- Challan confirmation
- Challan cancellation

### Challan Confirmation

When a draft challan is confirmed:

1. Product stock is checked.
2. The system verifies sufficient stock.
3. Product stock is reduced.
4. Stock OUT movements are created.
5. The challan status becomes `CONFIRMED`.

These database changes are performed as a transaction.

---

# Role-Based Access Control

OpsFlow supports four roles:

- ADMIN
- SALES
- WAREHOUSE
- ACCOUNTS

## Permission Matrix

| Feature             | ADMIN | SALES | WAREHOUSE | ACCOUNTS |
| ------------------- | :---: | :---: | :-------: | :------: |
| Dashboard           |   ✓   |   ✓   |     ✓     |    ✓     |
| Customers           |   ✓   |   ✓   |     -     |    ✓     |
| Create Customer     |   ✓   |   ✓   |     -     |    -     |
| Edit Customer       |   ✓   |   ✓   |     -     |    -     |
| Customer Follow-Ups |   ✓   |   ✓   |     -     |    -     |
| Products            |   ✓   |   ✓   |     ✓     |    -     |
| Create Product      |   ✓   |   -   |     ✓     |    -     |
| Edit Product        |   ✓   |   -   |     ✓     |    -     |
| Stock IN            |   ✓   |   -   |     ✓     |    -     |
| Stock OUT           |   ✓   |   -   |     ✓     |    -     |
| Inventory           |   ✓   |   -   |     ✓     |    -     |
| Challans            |   ✓   |   ✓   |     -     |    ✓     |
| Create Challan      |   ✓   |   ✓   |     -     |    -     |
| Confirm Challan     |   ✓   |   ✓   |     -     |    -     |
| Cancel Challan      |   ✓   |   ✓   |     -     |    -     |

Frontend RBAC controls navigation, UI actions, and protected routes.

Backend RBAC independently validates authorization for protected API operations.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma
- Zod

## Database

- PostgreSQL

## Authentication

- JWT
- HTTP-only cookies

## API Testing

- Postman

## Version Control

- Git
- GitHub

---

# Project Architecture

The application follows a frontend-backend architecture.

```text
                         User
                          |
                          v
                 React Frontend
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
       Redux          React Router      Axios
          |               |               |
          +---------------+---------------+
                          |
                          v
                   Express API
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
   Authentication       RBAC          Validation
          |               |               |
          +---------------+---------------+
                          |
                          v
                    Service Layer
                          |
                          v
                       Prisma
                          |
                          v
                     PostgreSQL

Database

The application uses PostgreSQL with Prisma ORM.

Main entities include:

User
Customer
CustomerFollowUp
Product
StockMovement
Challan
ChallanItem

Important relationships include:

User
 ├── StockMovements
 ├── CustomerFollowUps
 └── Challans

Customer
 ├── FollowUps
 └── Challans

Product
 ├── StockMovements
 └── ChallanItems

Challan
 ├── Customer
 ├── CreatedBy User
 └── ChallanItems

ChallanItem
 └── Product

The complete database structure is documented through the ER diagram in:

docs/architecture/ER_DIAGRAM.png
Project Structure
OpsFlow/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── generated/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validators/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── ...
│
├── docs/
│   ├── PROJECT_OVERVIEW.md
│   ├── API.md
│   ├── TESTING.md
│   └── architecture/
│
├── postman/
│   └── OpsFlow.postman_collection.json
│
└── README.md
Local Setup
Prerequisites

Install the following before running the project:

Node.js
npm
PostgreSQL
Git
Backend Setup

Navigate to the backend:

cd backend

Install dependencies:

npm install

Create the backend environment file:

.env

Configure the required environment variables according to the backend configuration.

The database connection should point to the PostgreSQL database used by the project.

Prisma Setup

Generate the Prisma client:

npx prisma generate

Apply the database migrations:

npx prisma migrate dev

If the project requires database seeding, run the configured seed command.

Start Backend

Run the development server:

npm run dev

The backend will run on the configured backend port.

Frontend Setup

Open another terminal and navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Open the URL shown by Vite in the terminal.

Environment Variables

Environment variables should be stored in .env files and should not be committed to GitHub.

Typical backend configuration includes values for:

DATABASE_URL
JWT_SECRET
PORT

The exact variables used by the project should be configured according to the backend environment configuration.

Never commit:

.env

or any credentials, passwords, tokens, or secrets.

API Documentation

Complete API documentation is available at:

docs/API.md

The API documentation contains:

Endpoints
HTTP methods
Authentication requirements
Allowed roles
Request bodies
Query parameters
Business rules
Response behavior
Testing Documentation

Testing details are available at:

docs/TESTING.md

The testing documentation covers:

Authentication
Customer management
Product management
Inventory
Stock movements
Challans
RBAC
Route protection
Validation
Business rules
Postman Collection

The Postman collection is available at:

postman/OpsFlow.postman_collection.json

It contains API requests for the major application modules.

Documentation

Additional project documentation is available in the docs directory.

docs/
├── PROJECT_OVERVIEW.md
├── API.md
├── TESTING.md
└── architecture/
Security

OpsFlow uses multiple layers of protection.

Authentication

Users must authenticate before accessing protected operations.

Frontend Authorization

The frontend hides unavailable actions and protects role-specific routes.

Backend Authorization

The backend independently checks user roles before executing protected operations.

Validation

Incoming request data is validated before reaching the service layer.

Database Transactions

Operations involving multiple related database changes are performed using transactions where required.

Important Business Rules
Inventory
Stock cannot become negative.
Stock IN increases current stock.
Stock OUT decreases current stock.
Every stock change creates a movement record.
Challans
New challans start in DRAFT.
Only draft challans can be confirmed.
Only draft challans can be cancelled.
Confirming a challan reduces product stock.
Insufficient stock prevents challan confirmation.
Challan stock operations are transactional.
Authorization
Frontend permissions control the user experience.
Backend authorization prevents unauthorized API operations.
Users cannot rely on frontend restrictions to bypass backend authorization.
Testing

The core application has been tested through:

Postman API testing
Frontend manual testing
Role-based testing
Validation testing
Inventory business-rule testing
Challan workflow testing

The current core functionality has been verified for the supported roles and modules.

Future Improvements

Potential future improvements include:

Dashboard analytics and charts
Advanced reporting
Exporting inventory and challan data
Audit logs
Automated notifications
More advanced search and filtering
Production deployment
Automated unit and integration tests
Automated CI/CD pipeline
More detailed analytics for different business roles


Project Status
Core Functionality
Authentication — Complete
Customer Management — Complete
Customer Follow-Ups — Complete
Product Management — Complete
Inventory — Complete
Stock Management — Complete
Challan Management — Complete
Frontend RBAC — Complete
Backend RBAC — Complete
API Testing — Complete


Documentation
Project Overview — Complete
API Documentation — Complete
Testing Documentation — Complete
README — Complete
ER Diagram — Complete
System Architecture Diagram — Complete
Postman Collection — Complete


License

This project was developed as part of an academic/project evaluation and is intended for educational and demonstration purposes.
```
