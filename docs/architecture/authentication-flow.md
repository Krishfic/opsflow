# OpsFlow Authentication Flow

```mermaid
flowchart TD
    A[Client] --> B[POST /api/auth/login]
    B --> C[Auth Controller]
    C --> D[Auth Service]
    D --> E[Find User in PostgreSQL]
    E --> F[Compare Password with bcrypt]
    F --> G[Generate JWT]
    G --> H[Set HTTP-only Cookie]
    H --> I[Authenticated Client]

    I --> J[Protected API Request]
    J --> K[Authentication Middleware]
    K --> L{Valid JWT?}

    L -->|No| M[401 Unauthorized]
    L -->|Yes| N[Attach user to Request]
    N --> O[Role Authorization Middleware]
    O --> P{Role Allowed?}

    P -->|No| Q[403 Forbidden]
    P -->|Yes| R[Controller]
