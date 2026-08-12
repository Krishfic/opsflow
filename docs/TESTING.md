# OpsFlow — Testing Documentation

## 1. Testing Overview

OpsFlow was tested at both the API and frontend levels.

API testing was performed using Postman, while frontend testing was performed through the application interface using different user roles.

The testing focused on:

- Authentication
- Authorization
- CRUD operations
- Input validation
- Inventory operations
- Stock movement tracking
- Challan workflows
- Role-based access control
- Protected frontend routes

---

# 2. Authentication Testing

## 2.1 Valid Login

### Test

Login using valid user credentials.

### Expected Result

- Login succeeds.
- Authentication cookie is established.
- Current user information is available.
- User is redirected to the dashboard.

### Result

PASS

---

## 2.2 Invalid Login

### Test

Attempt login using invalid credentials.

### Expected Result

- Login request is rejected.
- Appropriate error message is returned.
- User remains unauthenticated.

### Result

PASS

---

## 2.3 Current User

### Test

Request the current authenticated user.

### Expected Result

The API returns the authenticated user's:

- ID
- Name
- Email
- Role

### Result

PASS

---

## 2.4 Logout

### Test

Logout from an authenticated session.

### Expected Result

- Session is cleared.
- User information is removed from the frontend authentication state.
- Protected pages are no longer accessible.

### Result

PASS

---

# 3. Customer Module Testing

## 3.1 Customer Listing

### Test

Fetch the customer list.

### Expected Result

- Customers are returned.
- Pagination information is returned.
- Search functionality works.

### Result

PASS

---

## 3.2 Customer Search

### Test

Search customers using:

- Name
- Mobile number
- Business name

### Expected Result

Only matching customers are returned.

### Result

PASS

---

## 3.3 Customer Status Filter

### Test

Filter customers by status.

Supported statuses include:

- LEAD
- ACTIVE
- INACTIVE

### Expected Result

Only customers matching the selected status are returned.

### Result

PASS

---

## 3.4 Create Customer

### Test

Create a customer using valid information.

### Expected Result

- Customer is created successfully.
- New customer appears in the customer list.

### Result

PASS

---

## 3.5 Update Customer

### Test

Update an existing customer.

### Expected Result

- Customer information is updated.
- Updated information is displayed in the application.

### Result

PASS

---

## 3.6 Customer Follow-Up

### Test

Create a follow-up for a customer.

### Expected Result

- Follow-up is created.
- Follow-up note is stored.
- Follow-up date is stored.
- User who created the follow-up is recorded.

### Result

PASS

---

# 4. Product Module Testing

## 4.1 Product Listing

### Test

Fetch the product list.

### Expected Result

- Products are displayed.
- Pagination works.
- Search works.

### Result

PASS

---

## 4.2 Product Search

### Test

Search products using:

- Product name
- SKU
- Category

### Expected Result

Matching products are returned.

### Result

PASS

---

## 4.3 Low Stock Filter

### Test

Enable the Low Stock filter.

### Expected Result

Products whose current stock is less than or equal to their minimum stock are returned.

### Result

PASS

---

## 4.4 Create Product

### Test

Create a product as an ADMIN or WAREHOUSE user.

### Expected Result

- Product is created.
- Initial stock is zero.
- Product appears in the product list.

### Result

PASS

---

## 4.5 Unauthorized Product Creation

### Test

Attempt to create a product as SALES.

### Expected Result

- Frontend does not display the Add Product action.
- Protected frontend route prevents access.
- Backend authorization rejects the API request.

### Result

PASS

---

## 4.6 Product Details

### Test

Open an individual product.

### Expected Result

Product details are displayed, including:

- Product information
- Current stock
- Minimum stock
- Location
- Stock movement history

### Result

PASS

---

## 4.7 Product Update

### Test

Update product information as an ADMIN or WAREHOUSE user.

### Expected Result

Product information is updated successfully.

Current stock is not directly modified through product editing.

### Result

PASS

---

## 4.8 Unauthorized Product Update

### Test

Attempt to edit a product as SALES.

### Expected Result

- Edit action is not displayed.
- Protected route prevents access.
- Backend authorization rejects the request.

### Result

PASS

---

# 5. Stock Management Testing

## 5.1 Stock IN

### Test

Add stock to a product.

Example:

Current Stock: 50
Stock IN: 20

Expected Result
New Stock: 70

A corresponding IN stock movement is created.

Result

PASS

5.2 Stock OUT
Test

Remove stock from a product.

Example:

Current Stock: 70
Stock OUT: 10
Expected Result
New Stock: 60

A corresponding OUT stock movement is created.

Result

PASS

5.3 Prevent Negative Stock
Test

Attempt to remove more stock than currently available.

Example:

Current Stock: 10
Stock OUT: 20
Expected Result

The operation is rejected.

Stock must remain:

10
Result

PASS

5.4 Stock Movement History
Test

Perform Stock IN and Stock OUT operations.

Expected Result

The product movement history displays:

Movement type
Quantity
Reason
User who created the movement
Result

PASS

6. Inventory Module Testing
   6.1 Inventory Overview
   Test

Open the Inventory page as ADMIN or WAREHOUSE.

Expected Result

The page displays:

Total products
Total units
Low-stock count
Inventory table
Current stock
Minimum stock
Location
Stock status
Result

PASS

6.2 Inventory Product Navigation
Test

Select a product from the Inventory page.

Expected Result

The user is redirected to the corresponding Product Details page.

Result

PASS

6.3 Inventory Role Restriction
Test

Attempt to access Inventory as SALES or ACCOUNTS.

Expected Result
Inventory is not displayed in the Sidebar.
Direct access to /inventory is blocked by the frontend role-protected route.
Result

PASS

7. Challan Module Testing
   7.1 Create Draft Challan
   Test

Create a challan containing a valid customer and one or more products.

Expected Result
Challan is created.
Challan status is DRAFT.
Challan items are stored.
Result

PASS

7.2 Confirm Challan
Test

Confirm a draft challan when sufficient stock is available.

Expected Result
Challan status changes to CONFIRMED.
Product stock is reduced.
Stock OUT movements are created.
Result

PASS

7.3 Insufficient Stock During Challan Confirmation
Test

Attempt to confirm a challan when product stock is insufficient.

Expected Result
Confirmation fails.
Product stock is not reduced.
Challan remains in DRAFT status.
Result

PASS

7.4 Cancel Challan
Test

Cancel a draft challan.

Expected Result
Challan status changes to CANCELLED.
Result

PASS

7.5 Invalid Challan State
Test

Attempt to confirm or cancel a challan that is no longer in DRAFT status.

Expected Result

The operation is rejected.

Result

PASS

8. Role-Based Access Control Testing

RBAC was tested using all four supported roles.

8.1 ADMIN

Expected access:

Customers
Products
Inventory
Challans
Product creation
Product editing
Stock IN
Stock OUT
Challan management
Result

PASS

8.2 SALES

Expected access:

Dashboard
Customers
Products
Challans

Sales users can view products but cannot:

Create products
Edit products
Perform Stock IN
Perform Stock OUT
Access Inventory
Result

PASS

8.3 WAREHOUSE

Expected access:

Dashboard
Products
Inventory

Warehouse users can:

Create products
Edit products
Perform Stock IN
Perform Stock OUT
View stock movement history
Result

PASS

8.4 ACCOUNTS

Expected access:

Dashboard
Customers
Challans

Accounts users cannot access:

Product management
Inventory management
Stock operations
Result

PASS

9. Frontend Route Protection Testing

Protected routes were tested by directly entering restricted URLs.

Example

A SALES user attempting to access:

/products/new

is redirected to the dashboard.

A SALES user attempting to access:

/products/1/edit

is redirected to the dashboard.

A SALES user attempting to access:

/inventory

is redirected to the dashboard.

Result

PASS

10. Backend Authorization Testing

Frontend restrictions were not treated as the security boundary.

Protected API endpoints were also tested with unauthorized roles.

Expected Result

Unauthorized operations return:

403 Forbidden
Examples
SALES attempting to create a product
SALES attempting to update a product
SALES attempting Stock IN
SALES attempting Stock OUT
SALES attempting to access Inventory-related operations
Result

PASS

11. Validation Testing

Invalid request data was tested against the API validation layer.

Examples include:

Missing required fields
Invalid numeric values
Zero or negative quantities
Invalid IDs
Invalid customer information
Invalid product information
Invalid challan items
Expected Result

Invalid requests are rejected before reaching the relevant business logic.

Result

PASS

12. Transaction and Business Rule Testing

Important operations involving multiple database changes were tested.

Challan Confirmation

When a challan is confirmed:

Product stock is checked.
Stock is reduced.
Stock OUT movement is created.
Challan status is changed to CONFIRMED.

These operations are performed within a database transaction.

Expected Result

If a required operation fails, the transaction does not leave the database in an inconsistent state.

Result

PASS

13. Overall Testing Result

The core functional modules of OpsFlow have been manually tested through Postman and the frontend application.

The following areas have been verified:

Authentication
Customer management
Customer follow-ups
Product management
Inventory
Stock IN
Stock OUT
Negative stock prevention
Stock movement history
Challan creation
Challan confirmation
Challan cancellation
Frontend RBAC
Backend RBAC
Protected routes
Request validation
Overall Status

PASS — Core application functionality verified.
