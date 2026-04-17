# 🎓 Smart Campus System – Setup Guide

This guide will help you set up and run the **Smart Campus System** on your local machine.  
The project includes:

* 🧠 Spring Boot Backend  
* 🗄️ MySQL Database  
* ⚛️ React (Vite) Frontend  

---

## 🛠️ Step 1: Prepare Your Workspace

### ✅ Install Prerequisites

Make sure you have the following installed:

* Docker Desktop *(Recommended)*  
* Git  
* MySQL Workbench  
* Node.js *(Required if not using Docker)*  
* Java 23  
* Maven  

---

### 📁 Create Project Folder

```bash
mkdir MyProjects
cd MyProjects
```

---

### 📥 Clone Repository

```bash
git clone <your-repository-url>
cd Smart-Campus-System
```

---

## 🗄️ Step 2: Database Setup (MySQL Workbench)

Before running the application, prepare the database.

### 🔹 Option 1: Local MySQL (Port 3306)

```sql
CREATE DATABASE smart_campus_db;
```

---

### 🔹 Option 2: Docker MySQL (Port 3307)

* Database will run automatically via Docker  
* Connect using MySQL Workbench on port **3307**  

---

### ⚙️ Configuration

Update the file:

```
backend/src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3307/smart_campus_db?createDatabaseIfNotExist=true
```

---

## 🐳 Step 3: Run with Docker (Recommended)

This runs **backend + frontend + database together**.

```bash
docker-compose up --build
```

### ⏳ What happens:

* Pulls required images  
* Builds Spring Boot app  
* Installs frontend dependencies  

---

## 💻 Step 4: Manual Setup (Alternative)

### ▶️ Run Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

📍 Backend runs on:

```
http://localhost:8082
```

---

### ▶️ Run Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

📍 Frontend runs on:

```
http://localhost:5173
```

---

## 🖥️ Step 5: Access the Application

| Page          | URL                                      |
| ------------- | ---------------------------------------- |
| Landing Page  | http://localhost:5173                    |
| Login Page    | http://localhost:5173/login              |
| Register Page | http://localhost:5173/register           |
| Dashboard     | http://localhost:5173/dashboard          |

---

## 📝 Important Notes

### 🔐 Authentication

* Google OAuth 2.0  
* Email & Password login  

---

### 👥 Role Management

Default roles:

* `USER`  
* `ADMIN`  
* `TECHNICIAN`  

---

### 🔌 Port Configuration

| Service | Port                            |
| ------- | ------------------------------- |
| Backend | 8082                            |
| MySQL   | 3307 (Docker) → 3306 (Internal) |

---

### ⚠️ Environment Variables

* Do **NOT** commit:
  * `.env`  
  * `application.properties`  

* Always update `.example` files when adding new configs  

---

### 🧾 Auditability

* `users` table includes:
  * `created_at` timestamp for tracking and auditing  

---

## 🚀 You're Ready!

Your Smart Campus System should now be up and running 🎉  
If you face issues, check logs or verify your ports and configurations.

---
