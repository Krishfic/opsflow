# OpsFlow — Project Overview

## 1. Introduction

OpsFlow is a role-based operations management system designed to help businesses manage customers, products, inventory, stock movements, and delivery challans through a centralized web application.

The system provides different interfaces and permissions for administrators, sales users, warehouse users, and accounts users.

---

## 2. Problem Statement

Small and medium-sized businesses often manage customer information, inventory, stock movements, and delivery operations using disconnected systems or manual processes.

This can lead to:

- Difficulty tracking customer information
- Poor visibility into current inventory
- Manual stock calculation
- Inconsistent stock records
- Difficulty tracking follow-ups
- Lack of role-based access control
- Errors during delivery challan processing

OpsFlow addresses these problems by providing a centralized system for managing these operational activities.

---

## 3. Main Objectives

The main objectives of OpsFlow are:

- Provide centralized customer management
- Maintain product information
- Track current inventory
- Record stock IN and stock OUT movements
- Prevent negative inventory
- Maintain stock movement history
- Manage customer follow-ups
- Create and manage delivery challans
- Deduct inventory automatically when a challan is confirmed
- Provide role-based access control
- Provide separate functionality according to user responsibilities

---

## 4. User Roles

OpsFlow contains four user roles.

### ADMIN

The administrator has access to the complete system and can manage operational data across modules.

### SALES

Sales users primarily work with customers, products, and challans.

Sales users can view products but cannot create or edit products or directly modify inventory.

### WAREHOUSE

Warehouse users are responsible for product and inventory operations.

Warehouse users can:

- Create products
- Edit products
- Perform stock IN
- Perform stock OUT
- View inventory
- View stock movement history

### ACCOUNTS

Accounts users have access to customer and challan information relevant to their responsibilities.

---

## 5. Core Modules

### Authentication

The authentication module provides:

- User login
- User logout
- Current authenticated user
- Authentication using JWT
- HTTP-only cookie based authentication

---

### Customer Management

The customer module provides:

- Customer listing
- Customer search
- Customer filtering
- Customer details
- Customer creation
- Customer updates
- Customer follow-ups

Customer information includes:

- Name
- Mobile number
- Email
- Business name
- GST number
- Customer type
- Address
- Status
- Follow-up date
- Notes

---

### Product Management

The product module provides:

- Product listing
- Product search
- Product filtering
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

### Inventory Management

The inventory module provides an overview of current inventory.

It provides:

- Total products
- Total units in stock
- Low-stock products
- Current stock levels
- Minimum stock levels
- Product locations
- Inventory status

Inventory management reuses the product and stock movement functionality rather than maintaining a separate inventory data model.

---

### Stock Management

Stock can be managed through:

- Stock IN
- Stock OUT

Every stock movement records:

- Product
- Quantity
- Movement type
- Reason
- User who created the movement
- Creation timestamp

The system prevents stock OUT operations when sufficient inventory is not available.

---

### Challan Management

The challan module provides:

- Challan creation
- Draft challans
- Challan listing
- Challan details
- Challan confirmation
- Challan cancellation
- Customer association
- Product line items

When a draft challan is confirmed:

1. Product stock is checked.
2. Insufficient stock prevents confirmation.
3. Product stock is reduced.
4. A stock OUT movement is created.
5. The challan status changes to `CONFIRMED`.

---

## 6. Role-Based Access Control

OpsFlow implements role-based access control at both the frontend and backend levels.

### Frontend RBAC

Frontend RBAC controls:

- Navigation visibility
- Available actions
- Protected routes
- Role-specific UI

This prevents users from seeing actions that are not relevant to their role.

### Backend RBAC

Backend RBAC provides the actual authorization boundary.

Protected API endpoints validate the authenticated user's role before allowing operations.

Frontend restrictions therefore improve the user experience, while backend authorization prevents unauthorized API access.

---

## 7. Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Zod

### Database

- PostgreSQL

### Authentication

- JWT
- HTTP-only cookies

### Development and Testing

- Git
- GitHub
- Postman
- Visual Studio Code / preferred IDE

---

## 8. High-Level Application Flow

```text
User
  |
  v
Frontend
  |
  | Authentication / API Requests
  v
Backend API
  |
  +---- Authentication
  |
  +---- Customers
  |
  +---- Products
  |
  +---- Inventory
  |
  +---- Challans
  |
  v
Prisma ORM
  |
  v
PostgreSQL

## 9. Important Business Rules

The system follows several important business rules.

Product and Inventory
Only ADMIN and WAREHOUSE users can create products.
Only ADMIN and WAREHOUSE users can edit products.
Only ADMIN and WAREHOUSE users can perform stock IN.
Only ADMIN and WAREHOUSE users can perform stock OUT.
Stock cannot become negative.
Stock movements are recorded for inventory changes.
Challans
Challans are initially created as DRAFT.
Only draft challans can be confirmed.
Only draft challans can be cancelled.
A challan cannot be confirmed when there is insufficient stock.
Confirming a challan creates stock OUT movements.
Confirming a challan reduces the corresponding product stock.
Authentication
Protected operations require authentication.
Role-specific operations require appropriate authorization.
Authentication state is maintained on the frontend using Redux.


## 10. Project Status

The core functional modules of OpsFlow have been implemented and tested.

Completed modules include:

Authentication
Customers
Customer follow-ups
Products
Inventory
Stock management
Challans
Frontend role-based access control
Backend role-based access control
```
