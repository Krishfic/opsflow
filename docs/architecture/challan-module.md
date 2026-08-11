# Sales Challan Architecture

```mermaid
flowchart TD
    A[Sales User] --> B[Create Challan]
    B --> C[Authentication]
    C --> D[Role Authorization]
    D --> E[Validation]
    E --> F[Challan Service]

    F --> G[Fetch Customer]
    F --> H[Fetch Products]
    F --> I[Create Product Snapshots]
    F --> J[(PostgreSQL)]

    J --> K[DRAFT]

    K --> L{Confirm?}

    L -->|No| M[Remain Draft]
    L -->|Cancel| N[CANCELLED]

    L -->|Yes| O[Database Transaction]

    O --> P[Verify Stock]
    P -->|Insufficient| Q[Rollback]
    P -->|Sufficient| R[Reduce Product Stock]
    R --> S[Create Stock OUT Movement]
    S --> T[Set Challan CONFIRMED]
    T --> U[Commit]