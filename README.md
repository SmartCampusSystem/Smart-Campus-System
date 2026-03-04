
# Smart Campus System - Setup Guide 🎓

This guide will help you set up and run the Smart Campus project on your local machine. The project consists of a **Spring Boot** backend, a **MySQL** database, and a **React (Vite)** frontend.

---

## 🛠️ Step 1: Prepare Your Workspace

1. **Install Prerequisites**:
* **Docker Desktop** (Highly recommended for easy setup).
* **Git**.
* **MySQL Workbench**.
* **Node.js** (If running without Docker).
* **Java 17+ & Maven** (If running without Docker).


2. **Create a Project Folder**:
Open your terminal and run:
```bash
mkdir MyProjects
cd MyProjects

```


3. **Clone the Repository**:
```bash
git clone <your-repository-url>
cd Smart-Campus-System

```

---

## 🗄️ Step 2: Database Setup (MySQL Workbench)

Before running the application, you must prepare the database:

1. Open **MySQL Workbench** and connect to your local instance.
2. Create a new schema:
```sql
CREATE DATABASE smart_campus;

```


3. **Configuration**: Navigate to `backend/src/main/resources/` and ensure your `application.properties` matches your Workbench credentials (username/password).

---

## 🐳 Step 3: Running with Docker (Recommended)

This is the easiest way to run the Backend, Frontend, and Database all at once.

1. **Build and Start Containers**:
In the root directory (where the `docker-compose.yml` is located), run:
```bash
docker-compose up --build

```


2. **Wait for completion**: Docker will pull images, compile the Java code, and install React dependencies automatically.

---

## 💻 Step 4: Manual Setup (Alternative)

If you don't want to use Docker, follow these steps:

### Running the Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run

```

*The backend will start at `http://localhost:8080`.*

### Running the Frontend (React)

```bash
cd frontend
npm install
npm run dev

```

*The frontend will start at `http://localhost:5173`.*

---

## 🖥️ Step 5: Viewing the Application

Once the services are running, you can access the UI:

* **Login Page**: Go to `http://localhost:5173/`
* **Admin Dashboard**: Go to `http://localhost:5173/admin`
* **API Documentation**: `http://localhost:8080/swagger-ui.html` (if enabled).

---

## 📝 Important Notes for Developers

* **File Naming**: Always use `Login.jsx` (lowercase extension) for imports to avoid build errors.
* **Styling**: We use Tailwind CSS. For gradients, prefer the canonical `bg-linear-to-tr` class.
* **Environment Variables**: Do not commit your `.env` or `application.properties` with real passwords. Use the provided `.example` files.

---
