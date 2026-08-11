# Customer Module Architecture

```mermaid
flowchart TD
    A[React Customer UI] --> B[Customer REST API]

    B --> C[Authentication Middleware]
    C --> D[Role Authorization]
    D --> E[Validation Middleware]

    E --> F[Customer Controller]
    F --> G[Customer Service]
    G --> H[Prisma Client]
    H --> I[(PostgreSQL)]

    G --> J[Customer Follow-up]
    J --> H