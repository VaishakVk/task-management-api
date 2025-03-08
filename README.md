# Task Management API

This is a **Task Management API** built with **NestJS** and **MongoDB**.  
It provides authentication, task creation, assignment, and filtering features.

## Features

- **User Authentication** (JWT-based)
- **Task CRUD Operations**
- **Task Assignment**
- **Filtering & Pagination**
- **Security**
- **API Documentation with Swagger** ✅

---

## Setup & Installation

### **Clone the Repository**

```sh
git clone
cd task-management-api

```

### **Install Dependencies**

```sh
npm install
```

### **Environment Variables**

Create a .env file in the root folder:

```sh
MONGO_URI=mongodb://localhost:27017/tasks
JWT_SECRET=your-secret-key
PORT=3000
```

### **Run the Application**

```sh
npm run start
```

The API will be available at:
`http://localhost:3000`

## API Documentation

Swagger UI is available at:
`http://localhost:3000/api/docs`

### **Testing**

Run unit tests:

```sh
npm run test
```

### **Run E2E tests (Supertest):**

```sh
npm run test:e2e
```
