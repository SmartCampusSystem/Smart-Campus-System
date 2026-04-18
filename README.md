# 🎓 Smart Campus System – Setup Guide

This guide will help you set up and run the **Smart Campus System** on your local machine.
The project has been migrated to a **Cloud-based NoSQL architecture** for better scalability and shared data access.

---

## 📦 Project Includes

* 🧠 Spring Boot 3.x Backend
* ☁️ MongoDB Atlas (Cloud Database)
* ⚛️ React (Vite) Frontend

---

## 🛠️ Step 1: Prepare Your Workspace

### ✅ Install Prerequisites

Make sure you have the following installed:

* Java 23 (JDK)
* Node.js (v18 or higher)
* Docker Desktop (For containerized deployment)
* Git
* Maven *(Optional – `./mvnw` wrapper included)*

---

## 📥 Clone Repository

```bash
git clone <your-repository-url>
cd Smart-Campus-System
```

---

## 🗄️ Step 2: Database Configuration (MongoDB Atlas)

The system now uses **MongoDB Atlas** instead of MySQL.
No local database installation is required.

### ⚙️ Backend Configuration

Update the following file:

```
backend/src/main/resources/application.properties
```

```properties
# MongoDB Atlas Connection
spring.data.mongodb.uri=mongodb+srv://it23600898_smart_db:<password>@cluster0.mg148jy.mongodb.net/smart_campus_db?retryWrites=true&w=majority
```

> ⚠️ Replace `<password>` with your actual Atlas database user password.

---

## 🐳 Step 3: Run with Docker (Recommended)

```bash
docker-compose up --build
```

### ⏳ What happens:

* Builds the Spring Boot executable
* Containerizes the React frontend
* Connects the backend to MongoDB Atlas

---

## 💻 Step 4: Manual Setup (Alternative)

### ▶️ Run Backend (Spring Boot)

```bash
cd backend
./mvnw clean install -DskipTests
./mvnw spring-boot:run
```

📍 Backend runs on: **http://localhost:8082**

---

### ▶️ Run Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

📍 Frontend runs on: **http://localhost:5173**

---

## 🖥️ Step 5: Access the Application

| Page          | URL                             |
| ------------- | ------------------------------- |
| Landing Page  | http://localhost:5173           |
| Login Page    | http://localhost:5173/login     |
| Register Page | http://localhost:5173/register  |
| Dashboard     | http://localhost:5173/dashboard |

---

## 📝 Important Notes

### 🔐 Authentication

* Google OAuth 2.0 integration
* Email & Password login with BCrypt encryption

---

### 👥 Role Management

Users are assigned roles upon registration:

* ROLE_USER
* ROLE_ADMIN
* ROLE_TECHNICIAN

---

### 🔌 Port Configuration

* Backend: **8082**
* Frontend: **5173**
* Database: Cloud-hosted (Atlas uses port 27017 internally)

---

### 🧾 Auditability

The `users` collection in MongoDB includes:

* `_id`: Managed as a String (UUID/ObjectId)
* `createdAt`: Automatically generated via `@EnableMongoAuditing`

---

## 🚀 You're Ready!

Your **Smart Campus System** should now be up and running 🎉

Since the database is cloud-based, any data you add will be visible to all contributors.
