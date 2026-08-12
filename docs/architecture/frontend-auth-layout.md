# Frontend Authentication & Application Layout

## Overview

The OpsFlow frontend is built using React, TypeScript, Vite and Tailwind CSS.

The frontend communicates with the Express backend through Axios.

Authentication is implemented using an HttpOnly JWT cookie. The JWT is never stored in localStorage or sessionStorage.

---

## Frontend Architecture

flowchart TD
    A[React Application] --> B[React Router]

    B --> C[Login Page]

    C --> D[AuthContext]
    D --> E[Axios API Client]

    E --> F[Express Backend]
    F --> G[Authentication Middleware]
    G --> H[JWT in HttpOnly Cookie]

    D --> I[Authenticated User State]

    I --> J[Protected Routes]
    J --> K[App Layout]

    K --> L[Sidebar]
    K --> M[Header]
    K --> N[Page Content]

## Authentication Flow

sequenceDiagram
    participant U as User
    participant R as React
    participant A as Axios
    participant B as Backend

    U->>R: Enter email and password
    R->>A: POST /api/auth/login
    A->>B: Login request
    B->>B: Validate credentials
    B-->>A: Set HttpOnly JWT cookie
    B-->>A: Return authenticated user
    A-->>R: User data
    R->>R: Store user in AuthContext
    R->>R: Navigate to Dashboard

## Session Restoration

flowchart LR
    A[Application Starts]
    --> B[AuthContext]

    B --> C[GET /api/auth/me]

    C --> D[Browser Sends Cookie]

    D --> E[Backend Verifies JWT]

    E --> F{Authenticated?}

    F -->|Yes| G[Set User]
    F -->|No| H[User = null]

    G --> I[Protected Application]
    H --> J[Login Page]