# Finance Dashboard Backend

A role-based finance management backend API built with Node.js, Express, PostgreSQL, and Prisma. Designed to serve a finance dashboard frontend with secure, structured, and scalable backend logic.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Roles and Permissions](#roles-and-permissions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Design Decisions](#design-decisions)
- [Assumptions](#assumptions)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + bcryptjs |
| Validation | Zod |
| Documentation | Swagger (OpenAPI 3.0) |

---

## Project Structure
```
finance-dashboard-backend/
├── prisma/
│   └── schema.prisma         # Database schema and models
├── src/
│   ├── config/
│   │   ├── db.js             # Prisma client instance
│   │   └── swagger.js        # Swagger configuration
│   ├── controllers/          # Route handler functions
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── record.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification
│   │   ├── role.middleware.js    # Role based access control
│   │   └── error.middleware.js   # Global error handler
│   ├── routes/               # Express route definitions
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── record.routes.js
│   │   └── dashboard.routes.js
│   ├── services/             # Business logic layer
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── record.service.js
│   │   └── dashboard.service.js
│   ├── validators/           # Zod input validation schemas
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   └── record.validator.js
│   ├── utils/
│   │   ├── apiResponse.js    # Consistent response formatter
│   │   └── asyncHandler.js   # Async error wrapper
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── .env.example
├── .gitignore
└── README.md
```

---

## Features

### Core
- JWT based authentication with secure password hashing
- Role based access control with three user roles
- Full CRUD for financial records
- Soft delete for both users and records
- Pagination on all list endpoints
- Filtering records by type, category, and date range
- Dashboard summary APIs with aggregated analytics
- Monthly and weekly trend analysis
- Category wise financial totals
- Recent activity feed
- Global error handling with meaningful error messages
- Input validation on all endpoints using Zod
- API documentation via Swagger UI

---

## Roles and Permissions

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View own records      | ✅ | ✅ | ✅ |
| View all records      | ❌ | ❌ | ✅ |
| Create records        | ❌ | ✅ | ✅ |
| Update own records    | ❌ | ✅ | ✅ |
| Delete own records | ❌ | ✅ | ✅ |
| Access dashboard | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Toggle user status | ❌ | ❌ | ✅ |

---

## Getting Started

### Prerequisites
- Node.js v18 or above
- PostgreSQL installed and running
- npm

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/finance-dashboard-backend.git
cd finance-dashboard-backend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create your environment file**
```bash
cp .env.example .env
```
Then update `.env` with your PostgreSQL credentials.

**4. Create the PostgreSQL database**
```bash
psql -U postgres
CREATE DATABASE finance_db;
\q
```

**5. Run Prisma migrations**
```bash
npx prisma migrate dev --name init
```

**6. Generate Prisma client**
```bash
npx prisma generate
```

**7. Start the development server**
```bash
npm run dev
```

Server runs at: `http://localhost:5000`
Swagger docs at: `http://localhost:5000/api/docs`

---

## Environment Variables

Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/finance_db"
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Also update `.env.example` with the same keys but no values:
```env
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
NODE_ENV=
```

---

## API Overview

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and receive JWT token |
| GET | /api/auth/me | All roles | Get current user profile |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/users | Admin | Get all users with pagination |
| GET | /api/users/:id | Admin, Analyst | Get a single user |
| PATCH | /api/users/:id | Admin | Update user details or role |
| DELETE | /api/users/:id | Admin | Soft delete a user |
| PATCH | /api/users/:id/toggle-status | Admin | Activate or deactivate user |

### Financial Records
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/records | Admin, Analyst | Create a new record |
| GET | /api/records | All roles | Get records with filters and pagination |
| GET | /api/records/:id | All roles | Get a single record |
| PATCH | /api/records/:id | Admin, Analyst | Update a record |
| DELETE | /api/records/:id | Admin, Analyst | Soft delete a record |

**Supported filters for GET /api/records:**
- `type` — INCOME or EXPENSE
- `category` — partial match, case insensitive
- `startDate` and `endDate` — date range filter
- `page` and `limit` — pagination

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/dashboard/summary | Admin, Analyst | Total income, expense, net balance |
| GET | /api/dashboard/category-totals | Admin, Analyst | Totals grouped by category and type |
| GET | /api/dashboard/monthly-trends | Admin, Analyst | Income and expense trends last 12 months |
| GET | /api/dashboard/weekly-trends | Admin, Analyst | Income and expense trends last 4 weeks |
| GET | /api/dashboard/recent-activity | Admin, Analyst | Last 10 financial records |

---

## Design Decisions

**Layered architecture**
The project follows a controller → service → database pattern. Controllers handle HTTP concerns, services contain all business logic, and Prisma handles database access. This separation makes the code easy to maintain and test independently.

**PostgreSQL over MongoDB**
Financial data is relational by nature. Users own records, records belong to categories, and summaries aggregate across structured fields. PostgreSQL with Prisma gives strong schema enforcement and powerful aggregation queries ideal for a finance system.

**Soft delete over hard delete**
Both users and financial records use soft delete. Users have a `deletedAt` timestamp and records have an `isDeleted` boolean. This preserves data integrity and audit history, which is especially important in financial systems.

**Zod for validation**
Zod provides runtime type safety and schema validation with clean, readable error messages. It integrates naturally with JavaScript and makes validation logic easy to read and maintain.

**Role isolation in services**
Access control is enforced at two levels. The role middleware restricts which roles can access a route. The service layer enforces ownership, for example an Analyst can only update or delete their own records even if they have write access.

**Consistent API responses**
All responses follow the same structure with `success`, `message`, and `data` fields. This makes frontend integration predictable and error handling straightforward.

---

## Assumptions

- The system supports three fixed roles: VIEWER, ANALYST, and ADMIN. Roles are assigned at registration and can be updated by an Admin.
- Viewers can only read their own records and cannot access dashboard analytics.
- Analysts can create and manage their own records and access dashboard data but cannot manage other users.
- Admins have full access to all records and users across the system.
- Soft deleted users cannot login even if they have a valid token.
- Financial amounts are stored as floating point numbers and support decimal values.
- Dates are stored in UTC and filtered using ISO 8601 date strings.
- Pagination defaults to page 1 with a limit of 10 records if not specified.
- JWT tokens expire in 7 days by default and are not invalidated server side on logout.

---

## Live API Documentation

Once the server is running visit:
```
http://localhost:5000/api/docs
```

Use the Authorize button to enter your JWT token and test all endpoints interactively.