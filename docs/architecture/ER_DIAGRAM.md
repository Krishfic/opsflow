# OpsFlow — Entity Relationship Diagram

The following ER diagram represents the current database structure of OpsFlow.

```mermaid
erDiagram

    User {
        Int id PK
        String name
        String email UK
        String passwordHash
        Role role
        DateTime createdAt
        DateTime updatedAt
    }

    Customer {
        Int id PK
        String name
        String mobile
        String email
        String businessName
        String gstNumber
        CustomerType customerType
        String address
        CustomerStatus status
        DateTime followUpDate
        String notes
        DateTime createdAt
        DateTime updatedAt
    }

    CustomerFollowUp {
        Int id PK
        Int customerId FK
        Int createdById FK
        String note
        DateTime followUpDate
        DateTime createdAt
    }

    Product {
        Int id PK
        String name
        String sku UK
        String category
        Decimal unitPrice
        Int currentStock
        Int minimumStock
        String location
        DateTime createdAt
        DateTime updatedAt
    }

    StockMovement {
        Int id PK
        Int productId FK
        Int quantity
        MovementType type
        String reason
        Int createdById FK
        DateTime createdAt
    }

    Challan {
        Int id PK
        String challanNumber UK
        Int customerId FK
        Int totalQuantity
        ChallanStatus status
        Int createdById FK
        DateTime createdAt
        DateTime updatedAt
    }

    ChallanItem {
        Int id PK
        Int challanId FK
        Int productId FK
        String productNameSnapshot
        String skuSnapshot
        Decimal unitPriceSnapshot
        Int quantity
    }

    User ||--o{ CustomerFollowUp : creates
    User ||--o{ StockMovement : creates
    User ||--o{ Challan : creates

    Customer ||--o{ CustomerFollowUp : has
    Customer ||--o{ Challan : receives

    Product ||--o{ StockMovement : has
    Product ||--o{ ChallanItem : included_in

    Challan ||--o{ ChallanItem : contains

Entity Relationships
User → CustomerFollowUp

A user can create multiple customer follow-ups.

User 1 ──── * CustomerFollowUp
User → StockMovement

A user can create multiple stock movements.

User 1 ──── * StockMovement
User → Challan

A user can create multiple challans.

User 1 ──── * Challan
Customer → CustomerFollowUp

A customer can have multiple follow-up records.

Customer 1 ──── * CustomerFollowUp
Customer → Challan

A customer can have multiple challans.

Customer 1 ──── * Challan
Product → StockMovement

A product can have multiple stock movement records.

Product 1 ──── * StockMovement
Product → ChallanItem

A product can appear in multiple challan items.

Product 1 ──── * ChallanItem
Challan → ChallanItem

A challan contains one or more challan items.

Challan 1 ──── * ChallanItem
Important Design Decisions
Stock is maintained on Product

The current inventory quantity is stored in:

Product.currentStock

Stock changes are recorded separately in:

StockMovement

This provides both current inventory visibility and historical movement tracking.

Challan Item Snapshots

ChallanItem stores:

productNameSnapshot
skuSnapshot
unitPriceSnapshot

This preserves the product information used at the time the challan was created, even if the product's information is changed later.

Inventory Does Not Have a Separate Table

There is no separate Inventory model.

Inventory is derived from:

Product.currentStock
Product.minimumStock
Product.location
StockMovement

The frontend Inventory module therefore reuses the existing Product and Stock Movement data.

Enums

Role
    ADMIN
    SALES
    WAREHOUSE
    ACCOUNTS

CustomerType
    RETAIL
    WHOLESALE
    DISTRIBUTOR

CustomerStatus
    LEAD
    ACTIVE
    INACTIVE

MovementType
    IN
    OUT

ChallanStatus
    DRAFT
    CONFIRMED
    CANCELLED
```
