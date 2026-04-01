# Finance Backend System

A production-ready financial records management API built with modern backend engineering practices. Demonstrates layered architecture, secure authentication, role-based access control (RBAC), and data analytics capabilities using MongoDB aggregation pipelines.

## Overview

Finance Backend System is a RESTful API designed to manage financial records with enterprise-grade security and access control. The system employs a clean, layered architecture that separates concerns across routes, controllers, services, and models—ensuring maintainability, testability, and scalability.

This backend system is built to handle real-world requirements including multi-tenancy through user ownership validation, granular access control through role-based authorization, and complex data analytics through MongoDB aggregation pipelines.

---

## Architecture & Design

### Layered Architecture

The system follows a well-structured, layered design pattern:

```
HTTP Request
    ↓
Routes (Express Router)
    ↓
Middleware (Authentication & Authorization)
    ↓
Controllers (Request Handling & Orchestration)
    ↓
Services (Business Logic)
    ↓
Models (Data Access & Validation)
    ↓
MongoDB
```

**Separation of Concerns:**
- **Routes**: Define HTTP endpoints and verb mappings
- **Controllers**: Handle request/response, input parsing, and service orchestration
- **Services**: Encapsulate business logic and reusable operations
- **Models**: Define schemas, validations, and data persistence
- **Middleware**: Cross-cutting concerns (auth, authorization, error handling)

This architecture enables:
- Easy unit testing and mocking
- Clear responsibility boundaries
- Reduced code duplication
- Simplified maintenance and feature additions
- Straightforward debugging and tracing

---

## Tech Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | Server runtime environment |
| **Framework** | Express.js | 5.x | HTTP server and routing |
| **Database** | MongoDB | 4.4+ | Document-oriented data store |
| **ODM** | Mongoose | 9.x | Schema validation and data modeling |
| **Authentication** | JWT (jsonwebtoken) | 9.x | Stateless authentication tokens |
| **Password Security** | bcryptjs | 3.x | Password hashing with salt rounds |
| **Environment Config** | dotenv | 17.x | Environment variable management |
| **Dev Tools** | Nodemon | 3.x | Auto-restart on file changes |

---

## Core Features

### 1. JWT-Based Authentication
- Stateless token-based authentication
- Secure password hashing using bcryptjs (10 salt rounds)
- Token-based session management without server-side storage
- Bearer token validation in Authorization header

### 2. Role-Based Access Control (RBAC)
Three-tier authorization model:

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Viewer** | Read-only access to own records | Regular users monitoring finances |
| **Analyst** | Create, read, update own records; view analytics | Users managing transactions and insights |
| **Admin** | Full access to all user data and system operations | System administrators and operators |

Implemented through composable middleware allowing fine-grained endpoint protection.

### 3. User Management
- User registration with role assignment
- Password hashing before storage
- Active/inactive status for soft deactivation
- User profile retrieval with sensitive data exclusion
- Automatic timestamps (createdAt, updatedAt)

### 4. Financial Records CRUD
- **Create**: Add new financial records with amount, type, category, date, and description
- **Read**: Retrieve records with advanced filtering and pagination
- **Update**: Modify records with ownership validation
- **Delete**: Remove records with proper authorization checks
- **Ownership Validation**: Users access only their own records

### 5. Advanced Filtering & Search
- Filter by transaction type (income/expense)
- Filter by category (salary, groceries, utilities, etc.)
- Query by date range (from/to dates)
- Combination filtering for complex queries

### 6. Pagination
- Configurable page size and page number
- Total records count for frontend pagination UI
- Optimized database queries using limit and skip

### 7. Dashboard Analytics
Aggregation-based analytics providing financial insights:

| Metric | Calculation | Purpose |
|--------|-----------|---------|
| **Total Income** | Sum of all income transactions | Understanding earning sources |
| **Total Expenses** | Sum of all expense transactions | Budget tracking |
| **Net Balance** | Income - Expenses | Overall financial health |
| **Category Breakdown** | Expenses grouped by category | Spending pattern analysis |
| **Recent Transactions** | Last 10 transactions | Quick transaction review |
| **Monthly Trends** | Income/expenses by month | Historical financial patterns |

Implemented using MongoDB aggregation pipeline for efficient server-side computation.

### 8. Input Validation & Error Handling
- Schema-level validation through Mongoose
- HTTP status codes following REST conventions
- Meaningful error messages for client debugging
- Centralized error handling in controllers
- Password complexity requirements

---

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|----------------|---------------|
| POST | `/api/auth/register` | Register new user | No | - |
| POST | `/api/auth/login` | Authenticate user and receive JWT | No | - |
| GET | `/api/auth/me` | Get current user profile | Yes | Any |

### Records Management

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/records` | Fetch user's records with pagination & filters | Yes | Viewer+ |
| POST | `/api/records` | Create new financial record | Yes | Analyst+ |
| GET | `/api/records/:id` | Get specific record details | Yes | Analyst+ |
| PUT | `/api/records/:id` | Update record (ownership validated) | Yes | Analyst+ |
| DELETE | `/api/records/:id` | Delete record (ownership validated) | Yes | Analyst+ |

**Query Parameters for GET /api/records:**
- `page=1` - Page number (default: 1)
- `limit=10` - Records per page (default: 10)
- `type=income` - Filter by type (income/expense)
- `category=salary` - Filter by category
- `startDate=2024-01-01` - Filter from date (ISO 8601)
- `endDate=2024-12-31` - Filter to date (ISO 8601)

### Dashboard Routes

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|----------------|---------------|
| GET | `/api/dashboard/analytics` | Get comprehensive financial analytics | Yes | Analyst+ |

---

## Role-Based Access Control (RBAC)

### Implementation Strategy

Authorization is enforced at the middleware layer, allowing declarative endpoint protection:

```javascript
router.post("/records", protect, authorizeRoles("analyst", "admin"), createRecord);
```

**Protection Flow:**
1. `protect` middleware validates JWT token
2. `authorizeRoles` middleware verifies user's role
3. Controller executes if both checks pass
4. Request fails fast with 401/403 status if unauthorized

### Data Isolation

- Each user accesses only their own records
- Dashboard analytics filtered by user ID
- Queries include implicit user ownership checks
- Admin role can bypass ownership validation for system operations

---

## Data Validation & Error Handling Strategy

### Input Validation

**Schema-Level Validation:**
- Required field enforcement through Mongoose
- Email uniqueness constraints
- Enum validation for role and transaction types
- Automatic timestamp generation

**Controller-Level Validation:**
- Email format verification
- Password complexity requirements
- Date range sanity checks
- Amount validation (positive values)

### Error Handling

**HTTP Status Codes (REST Convention):**
- `200 OK` - Successful GET/PUT requests
- `201 Created` - Successful resource creation
- `400 Bad Request` - Invalid input or validation failure
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server-side exceptions

**Error Response Format:**
```json
{
  "message": "User-friendly error description",
  "status": 400
}
```

---

## Design Decisions & Rationale

### 1. Layered Architecture Over Monolithic
**Decision:** Separate routes, controllers, services, and models into distinct layers.

**Rationale:**
- Enables horizontal scalability of components
- Facilitates unit testing without full stack setup
- Clear ownership and responsibility boundaries
- Proven pattern in enterprise systems
- Easier onboarding for new developers

### 2. JWT Over Session-Based Authentication
**Decision:** Use JWT tokens for stateless authentication instead of server-side sessions.

**Rationale:**
- Stateless design scales horizontally without sticky sessions
- Tokens can be passed to microservices easily
- Reduced memory footprint on servers
- Better for mobile and SPA applications
- Aligns with cloud-native architecture principles

### 3. Middleware-Based Authorization
**Decision:** Implement RBAC through composable middleware functions.

**Rationale:**
- Declarative security (security requirements visible in route definitions)
- Composable and reusable authorization checks
- Separates authentication from authorization concerns
- Easy to audit which endpoints require which roles
- Supports granular permission models in future

### 4. MongoDB Aggregation for Analytics
**Decision:** Use MongoDB aggregation pipeline instead of application-level computation.

**Rationale:**
- Database-side computation reduces data transfer
- Leverages MongoDB's optimized aggregation engine
- Complex queries executed efficiently at storage layer
- Scales better with large datasets
- Reduces application memory usage

### 5. Mongoose for ODM
**Decision:** Use Mongoose schema validation instead of raw MongoDB driver.

**Rationale:**
- Schema enforcement prevents data inconsistencies
- Built-in validation reduces controller-level code
- Middleware hooks for business logic (e.g., password hashing)
- Type safety and IDE autocompletion
- Faster development with less boilerplate

### 6. Environment-Based Configuration
**Decision:** Use .env files and dotenv for configuration management.

**Rationale:**
- Separates configuration from code
- Security: prevents hardcoding credentials
- Environment parity (dev, staging, production same codebase)
- Follows twelve-factor app principles
- Easy credential rotation without code changes

---

## Assumptions & Constraints

### Assumptions Made

1. **MongoDB Hosting:** System assumes MongoDB is accessible via connection string in `MONGODB_URI` environment variable
2. **JWT Secret:** A strong JWT secret string is provided via `JWT_SECRET` environment variable (min 32 characters recommended)
3. **Port Configuration:** Server port is configurable via `PORT` env var, defaults to 5000
4. **Database Initialization:** MongoDB database and indexes are automatically created on connection
5. **User Roles:** Only three predefined roles exist (viewer, analyst, admin) — no custom role creation
6. **Single Tenant:** Each user account is isolated; no multi-tenant organization support
7. **Record Ownership:** Financial records are inherently tied to the authenticated user

### Current Constraints

- Single database instance (no replication/clustering configured)
- No rate limiting implemented (recommended for production)
- No API request logging or audit trails
- Limited to simple date filtering (no complex temporal queries)
- No soft-delete for records (deletions are permanent)
- No notification system (email/SMS) for account events

---

## Setup & Installation

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB 4.4+ instance (local or remote)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd finance-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in project root:

```env
# Server
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/finance-db

# Authentication
JWT_SECRET=your_very_secure_32_character_secret_key_here

# Environment
NODE_ENV=development
```

**Important:** Never commit `.env` file to version control. Add it to `.gitignore`.

### 4. Start MongoDB
```bash
# Local MongoDB (if installed)
mongod

# Or use MongoDB Atlas (cloud) connection string
```

### 5. Run Server

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server will be available at `http://localhost:5000`

### 6. Verify Installation
```bash
curl http://localhost:5000/
# Expected response: "Finance Backend Running 🚀"
```

---

## Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "role": "analyst"
  }'
```

### Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'

# Response includes: { "token": "eyJhbGc..." }
```

### Create Financial Record
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "salary",
    "date": "2024-04-01",
    "description": "Monthly salary payment"
  }'
```

### Fetch Records with Filtering
```bash
curl -X GET "http://localhost:5000/api/records?type=expense&category=utilities&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Dashboard Analytics
```bash
curl -X GET http://localhost:5000/api/dashboard/analytics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Project Structure

```
finance-backend/
├── src/
│   ├── app.js                      # Express app initialization
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # Auth logic (register, login)
│   │   ├── dashboardController.js  # Analytics aggregation
│   │   └── recordController.js     # Record CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT validation
│   │   └── roleMiddleware.js       # RBAC enforcement
│   ├── models/
│   │   ├── User.js                 # User schema & model
│   │   └── Record.js               # Financial record schema
│   ├── routes/
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── dashboardRoutes.js      # Analytics endpoints
│   │   └── recordRoutes.js         # Record endpoints
│   ├── services/                   # Business logic layer
│   └── utils/                      # Utility functions
├── package.json                    # Dependencies and scripts
└── README.md                        # This file
```

---

## Future Enhancements

### Phase 1: Reliability & Operations
- [ ] Comprehensive API documentation (Swagger/OpenAPI)
- [ ] Unit and integration test suite
- [ ] API request logging and audit trails
- [ ] Rate limiting per user/IP
- [ ] Input sanitization and SQL injection prevention
- [ ] Health check endpoints for monitoring

### Phase 2: Feature Expansion
- [ ] Soft-delete for records with restore capability
- [ ] Budget management and spending alerts
- [ ] Recurring transactions automation
- [ ] Multi-currency support with exchange rates
- [ ] Receipt/document attachment storage
- [ ] Export records to CSV/PDF

### Phase 3: Advanced Features
- [ ] Advanced filtering with complex queries (custom date ranges, multi-category)
- [ ] Data export and reporting (monthly/yearly statements)
- [ ] Notification system (email alerts on thresholds)
- [ ] Two-factor authentication (2FA/MFA)
- [ ] Transaction tagging and custom categories
- [ ] Budget forecasting using ML models

### Phase 4: Scale & Security
- [ ] API versioning strategy
- [ ] Database indexing optimization
- [ ] Caching layer (Redis)
- [ ] Message queue for async operations
- [ ] Enhanced security (IP whitelisting, WAF)
- [ ] Distributed tracing for performance monitoring

---

### Author
Ayush Kumar
