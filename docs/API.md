# OpsFlow — API Documentation

## 1. API Overview

The OpsFlow backend exposes REST APIs for authentication, customer management, product management, inventory operations, and delivery challans.

All protected endpoints require authentication.

Role-based authorization is applied to protected operations.

---

## 2. Base URL

For local development:

http://localhost:5000/api

3. Authentication APIs
   3.1 Login
   Endpoint
   POST /auth/login
   Authentication

Not required.

Request Body
{
"email": "admin@example.com",
"password": "your-password"
}
Description

Authenticates a user and establishes the authenticated session.

Roles

All registered users can authenticate.

3.2 Get Current User
Endpoint
GET /auth/me
Authentication

Required.

Description

Returns information about the currently authenticated user.

Roles

Any authenticated role.

3.3 Logout
Endpoint
POST /auth/logout
Authentication

Required.

Description

Logs out the current user and clears the authentication session.

Roles

Any authenticated role.

4. Customer APIs
   4.1 Get Customers
   Endpoint
   GET /customers
   Authentication

Required.

Allowed Roles
ADMIN
SALES
ACCOUNTS
Query Parameters
page
limit
search
status

Example:

GET /customers?page=1&limit=10&search=krishna&status=ACTIVE
Description

Returns a paginated list of customers.

Search can be performed against relevant customer information such as:

Name
Mobile
Business name

Customer status can be filtered using the supported status values.

4.2 Get Customer By ID
Endpoint
GET /customers/:id
Authentication

Required.

Allowed Roles
ADMIN
SALES
ACCOUNTS
Description

Returns detailed information about a specific customer.

4.3 Create Customer
Endpoint
POST /customers
Authentication

Required.

Allowed Roles
ADMIN
SALES
Request Body
{
"name": "Customer Name",
"mobile": "9876543210",
"email": "customer@example.com",
"businessName": "Example Business",
"gstNumber": "GSTNUMBER",
"customerType": "RETAIL",
"address": "Customer Address",
"status": "LEAD",
"followUpDate": "2026-08-15T10:00:00.000Z",
"notes": "Customer notes"
}
Description

Creates a new customer.

4.4 Update Customer
Endpoint
PATCH /customers/:id
Authentication

Required.

Allowed Roles
ADMIN
SALES
Description

Updates customer information.

4.5 Add Customer Follow-Up
Endpoint
POST /customers/:id/follow-ups
Authentication

Required.

Allowed Roles
ADMIN
SALES
Request Body
{
"note": "Follow up with customer regarding quotation",
"followUpDate": "2026-08-15T10:00:00.000Z"
}
Description

Creates a follow-up entry for a customer.

The authenticated user is stored as the user who created the follow-up.

4.6 Get Customer Follow-Ups
Endpoint
GET /customers/:id/follow-ups
Authentication

Required.

Allowed Roles
ADMIN
SALES
Description

Returns the follow-up history associated with a customer.

5. Product APIs
   5.1 Get Products
   Endpoint
   GET /products
   Authentication

Required.

Allowed Roles
ADMIN
SALES
WAREHOUSE
Query Parameters
page
limit
search
lowStock

Example:

GET /products?page=1&limit=10&search=cement&lowStock=true
Description

Returns a paginated list of products.

The lowStock filter returns products whose current stock is at or below their configured minimum stock.

5.2 Get Product By ID
Endpoint
GET /products/:id
Authentication

Required.

Allowed Roles
ADMIN
SALES
WAREHOUSE
Description

Returns detailed product information including stock movement history.

5.3 Create Product
Endpoint
POST /products
Authentication

Required.

Allowed Roles
ADMIN
WAREHOUSE
Request Body
{
"name": "Example Product",
"sku": "PROD-001",
"category": "General",
"unitPrice": 500,
"minimumStock": 10,
"location": "Rack A"
}
Description

Creates a new product.

The initial current stock is zero.

5.4 Update Product
Endpoint
PATCH /products/:id
Authentication

Required.

Allowed Roles
ADMIN
WAREHOUSE
Request Body
{
"name": "Updated Product",
"category": "Updated Category",
"unitPrice": 550,
"minimumStock": 15,
"location": "Rack B"
}
Description

Updates product information.

Current stock is not directly modified through this endpoint.

Stock changes must be performed through stock movement operations.

5.5 Stock IN
Endpoint
POST /products/:id/stock-in
Authentication

Required.

Allowed Roles
ADMIN
WAREHOUSE
Request Body
{
"quantity": 50,
"reason": "New purchase"
}
Description

Adds stock to a product.

A corresponding IN stock movement is recorded.

5.6 Stock OUT
Endpoint
POST /products/:id/stock-out
Authentication

Required.

Allowed Roles
ADMIN
WAREHOUSE
Request Body
{
"quantity": 10,
"reason": "Damaged items"
}
Description

Removes stock from a product.

The operation is rejected if the requested quantity exceeds the current stock.

A corresponding OUT stock movement is recorded.

6. Inventory APIs

Inventory currently reuses the Product APIs instead of maintaining a separate inventory API.

The frontend Inventory page uses:

GET /products

with the following information:

Current stock
Minimum stock
Product location
Category
SKU
Low-stock status

Stock changes are performed using:

POST /products/:id/stock-in
POST /products/:id/stock-out

This keeps product stock and inventory information synchronized.

7. Challan APIs
   7.1 Get Challans
   Endpoint
   GET /challans
   Authentication

Required.

Allowed Roles
ADMIN
SALES
ACCOUNTS
Query Parameters
page
limit
search
status

Example:

GET /challans?page=1&limit=10&status=DRAFT
Description

Returns a paginated list of challans.

Challans can be filtered by status and searched using relevant challan/customer information.

7.2 Get Challan By ID
Endpoint
GET /challans/:id
Authentication

Required.

Allowed Roles
ADMIN
SALES
ACCOUNTS
Description

Returns detailed challan information including customer and line items.

7.3 Create Challan
Endpoint
POST /challans
Authentication

Required.

Allowed Roles
ADMIN
SALES
Request Body
{
"customerId": 1,
"items": [
{
"productId": 1,
"quantity": 5
},
{
"productId": 2,
"quantity": 10
}
]
}
Description

Creates a new challan in DRAFT status.

Product name, SKU, and unit price are stored as snapshots in the challan items.

7.4 Confirm Challan
Endpoint
POST /challans/:id/confirm
Authentication

Required.

Allowed Roles
ADMIN
SALES
Description

Confirms a draft challan.

During confirmation:

The challan must exist.
The challan must be in DRAFT status.
Product stock is checked.
Confirmation fails if sufficient stock is unavailable.
Product stock is reduced.
OUT stock movements are created.
The challan status changes to CONFIRMED.

The stock updates and challan status update are performed as a database transaction.

7.5 Cancel Challan
Endpoint
POST /challans/:id/cancel
Authentication

Required.

Allowed Roles
ADMIN
SALES
Description

Cancels a draft challan.

Only challans with DRAFT status can be cancelled.

The challan status changes to CANCELLED.

8. Role Permission Matrix

| Operation       | ADMIN | SALES | WAREHOUSE | ACCOUNTS |
| --------------- | :---: | :---: | :-------: | :------: |
| View Customers  |  Yes  |  Yes  |    No     |   Yes    |
| Create Customer |  Yes  |  Yes  |    No     |    No    |
| Update Customer |  Yes  |  Yes  |    No     |    No    |
| Add Follow-Up   |  Yes  |  Yes  |    No     |    No    |
| View Products   |  Yes  |  Yes  |    Yes    |    No    |
| Create Product  |  Yes  |  No   |    Yes    |    No    |
| Update Product  |  Yes  |  No   |    Yes    |    No    |
| Stock IN        |  Yes  |  No   |    Yes    |    No    |
| Stock OUT       |  Yes  |  No   |    Yes    |    No    |
| View Inventory  |  Yes  |  No   |    Yes    |    No    |
| View Challans   |  Yes  |  Yes  |    No     |   Yes    |
| Create Challan  |  Yes  |  Yes  |    No     |    No    |
| Confirm Challan |  Yes  |  Yes  |    No     |    No    |
| Cancel Challan  |  Yes  |  Yes  |    No     |    No    |

9. Common HTTP Responses

The API uses standard HTTP status codes.

200 — Success

The requested operation completed successfully.

201 — Created

A new resource was successfully created.

400 — Bad Request

The request contains invalid data or violates a business rule.

Examples:

Invalid ID
Invalid request body
Insufficient stock
Invalid challan state
401 — Unauthorized

Authentication is missing or invalid.

Example:

{
"success": false,
"message": "Authentication required"
}
403 — Forbidden

The authenticated user does not have permission to perform the requested operation.

404 — Not Found

The requested resource does not exist.

500 — Internal Server Error

An unexpected server-side error occurred.

10. Validation

Request validation is performed using Zod schemas before data reaches the relevant controller.

Validation is applied to operations including:

Customer creation
Customer updates
Follow-ups
Product creation
Product updates
Stock movements
Challan creation

This prevents invalid data from reaching the service layer.

11. Security and Authorization

Protected endpoints use authentication middleware to verify the authenticated user.

Role-based authorization middleware then verifies whether the user's role is allowed to perform the requested operation.

The frontend also applies role-based UI and route restrictions, but backend authorization remains the actual security boundary.

12. API Testing

The APIs are tested using Postman.

The Postman collection included in the project contains requests for:

Authentication
Customers
Follow-ups
Products
Stock movements
Challans
Role-based authorization scenarios
Validation and business-rule scenarios
