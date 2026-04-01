# 💰 Finance Backend System (RBAC + Analytics)

## 🚀 Overview

This project is a backend system for managing financial records with **role-based access control (RBAC)** and **secure authentication**.

It is designed to simulate a real-world finance dashboard backend where multiple users interact with financial data based on their roles.

---

## 🧠 Key Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure login & registration
* Role-based access control (RBAC)

### 👤 User Management

* Create users with roles:

  * Viewer
  * Analyst
  * Admin
* User status management (active/inactive)

### 💰 Financial Records

* Create, read, update, delete (CRUD)
* Each record includes:

  * Amount
  * Type (income/expense)
  * Category
  * Date
  * Description

### 🔍 Filtering

* Filter records by:

  * Type
  * Category
  * Date range

### 🛡️ Access Control

* Viewer → No access to records
* Analyst → Read-only access
* Admin → Full access

---

## 🏗️ Project Structure

```
src/
│
├── config/        # Database connection
├── models/        # Mongoose schemas
├── controllers/   # Business logic
├── routes/        # API routes
├── middleware/    # Auth & RBAC
├── services/      # (for future logic)
├── utils/         # Helpers
└── app.js         # Entry point
```

---

## ⚙️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcrypt (password hashing)

---

## 🔑 API Endpoints

### 🔐 Auth

#### Register

```
POST /api/auth/register
```

#### Login

```
POST /api/auth/login
```

---

### 💰 Records

#### Create Record (Admin only)

```
POST /api/records
```

#### Get Records (Analyst, Admin)

```
GET /api/records
```

#### Update Record (Admin only)

```
PUT /api/records/:id
```

#### Delete Record (Admin only)

```
DELETE /api/records/:id
```

---

## 🔒 Authorization Rules

| Role    | Access         |
| ------- | -------------- |
| Viewer  | Dashboard only |
| Analyst | View records   |
| Admin   | Full access    |

---

## 🧪 Validation & Error Handling

* Handles invalid input
* Returns proper HTTP status codes:

  * 400 → Bad Request
  * 401 → Unauthorized
  * 403 → Forbidden
  * 404 → Not Found

---

## ⚡ Setup Instructions

### 1. Clone Repository

```
git clone <your-repo-link>
cd finance-backend
```

### 2. Install Dependencies

```
npm install
```

### 3. Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### 4. Run Server

```
npm run dev
```

---

## 🧠 Design Decisions

* Used **JWT** for stateless authentication
* Implemented **RBAC using middleware**
* Separated concerns using controllers, routes, and models
* Used MongoDB for flexible financial data storage

---

## 🚀 Current Status

* ✅ Authentication system
* ✅ Role-based access control
* ✅ Financial records CRUD
* ✅ Filtering functionality

---

## 🔮 Future Enhancements

* Dashboard analytics (aggregation)
* Pagination
* API documentation (Swagger)
* Unit testing

---

## 👨‍💻 Author

**Ayush Kumar**

---
