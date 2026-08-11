erDiagram

    USER {
        int id PK
        string name
        string email UK
        string passwordHash
        Role role
        datetime createdAt
        datetime updatedAt
    }

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

    PRODUCT {
        int id PK
        string name
        string sku UK
        string category
        decimal unitPrice
        int currentStock
        int minimumStock
        string location
        datetime createdAt
        datetime updatedAt
    }

    STOCK_MOVEMENT {
        int id PK
        int productId FK
        int quantity
        MovementType type
        string reason
        int createdById FK
        datetime createdAt
    }

    CHALLAN {
        int id PK
        string challanNumber UK
        int customerId FK
        int totalQuantity
        ChallanStatus status
        int createdById FK
        datetime createdAt
        datetime updatedAt
    }

    CHALLAN_ITEM {
        int id PK
        int challanId FK
        int productId FK
        string productNameSnapshot
        string skuSnapshot
        decimal unitPriceSnapshot
        int quantity
    }

    USER ||--o{ STOCK_MOVEMENT : creates
    USER ||--o{ CHALLAN : creates
    USER ||--o{ CUSTOMER_FOLLOW_UP : creates

    CUSTOMER ||--o{ CHALLAN : has
    CUSTOMER ||--o{ CUSTOMER_FOLLOW_UP : has

    PRODUCT ||--o{ STOCK_MOVEMENT : has
    PRODUCT ||--o{ CHALLAN_ITEM : appears_in

    CHALLAN ||--o{ CHALLAN_ITEM : contains