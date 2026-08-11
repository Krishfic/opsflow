# Inventory Module Architecture

```mermaid
flowchart TD
    A[Client] --> B[Product API]

    B --> C[Authentication]
    C --> D[Role Authorization]
    D --> E[Validation]
    E --> F[Product Controller]
    F --> G[Product Service]
    G --> H[Prisma]
    H --> I[(PostgreSQL)]

    G --> J{Stock IN / OUT}

    J --> K[Create Stock Movement]
    J --> L[Update Current Stock]

    K --> M[Transaction]
    L --> M

    M --> I

    M --> N{Success?}
    N -->|Yes| O[Commit]
    N -->|No| P[Rollback]