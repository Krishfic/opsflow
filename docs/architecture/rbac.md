# OpsFlow RBAC

```mermaid
flowchart TD
    U[Authenticated User] --> R{User Role}

    R --> A[ADMIN]
    R --> S[SALES]
    R --> W[WAREHOUSE]
    R --> AC[ACCOUNTS]

    A --> AP[Authorized APIs]
    S --> SP[Authorized APIs]
    W --> WP[Authorized APIs]
    AC --> ACP[Authorized APIs]