# 🏥 Hospital Management System
### Java Full Stack Project | Spring Boot + React + MySQL

---

## Tech Stack
| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Java 17, Spring Boot 3.2, Spring Security, JPA/Hibernate |
| Frontend  | React 18, Redux Toolkit, Axios, React Router |
| Database  | MySQL 8                             |
| Auth      | JWT (JSON Web Tokens)               |
| Build     | Maven (backend), npm (frontend)     |

---

## Features
- ✅ JWT Authentication with Role-Based Access (Admin, Doctor, Receptionist, Patient)
- ✅ Patient Management (Register, Search, Update, Delete)
- ✅ Doctor Management with specializations
- ✅ Appointment Booking & Status Updates (Scheduled → Confirmed → Completed)
- ✅ Prescription & Diagnosis tracking
- ✅ Billing & Payment management
- ✅ Admin Dashboard with real-time stats
- ✅ Pagination & Search on all lists
- ✅ Global exception handling
- ✅ CORS configured for React frontend

---

## Setup Instructions

### 1. Database Setup
```sql
-- Install MySQL 8, then run:
CREATE DATABASE hms_db;
```

### 2. Backend Setup
```bash
cd backend

# Edit application.properties:
# spring.datasource.password=YOUR_MYSQL_PASSWORD

# Run:
mvn spring-boot:run
```
Backend starts at: http://localhost:8080

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend starts at: http://localhost:3000

---

## API Endpoints

### Auth
| Method | Endpoint          | Description    | Access |
|--------|-------------------|----------------|--------|
| POST   | /api/auth/login   | Login + JWT    | Public |
| POST   | /api/auth/register| Register user  | Public |

### Patients
| Method | Endpoint           | Description          | Access         |
|--------|--------------------|----------------------|----------------|
| GET    | /api/patients      | List all (paginated) | All staff      |
| POST   | /api/patients      | Register patient     | All staff      |
| GET    | /api/patients/{id} | Get by ID            | All staff      |
| PUT    | /api/patients/{id} | Update patient       | All staff      |
| DELETE | /api/patients/{id} | Delete patient       | Admin only     |

### Appointments
| Method | Endpoint                    | Description      | Access    |
|--------|-----------------------------|------------------|-----------|
| GET    | /api/appointments           | List all         | All staff |
| POST   | /api/appointments           | Book appointment | All staff |
| GET    | /api/appointments/today     | Today's list     | All staff |
| PUT    | /api/appointments/{id}/status| Update status  | Doctor    |

### Dashboard
| Method | Endpoint          | Description  | Access |
|--------|-------------------|--------------|--------|
| GET    | /api/dashboard/stats | All stats | All    |

---

## First Admin User
Add via Postman after running the app:
```json
POST /api/auth/register
{
  "username": "admin",
  "password": "admin123",
  "email": "admin@hospital.com",
  "fullName": "Admin User",
  "role": "ADMIN"
}
```

---

## Project Structure
```
hospital-management-system/
├── backend/
│   └── src/main/java/com/hms/
│       ├── config/          → Security, CORS config
│       ├── controller/      → REST API controllers
│       ├── dto/             → Request/Response DTOs
│       ├── entity/          → JPA entities (User, Patient, Doctor, Appointment, Bill)
│       ├── exception/       → Custom exceptions + global handler
│       ├── repository/      → Spring Data JPA repositories
│       ├── security/        → JWT filter, UserDetailsService
│       └── service/impl/    → Business logic
└── frontend/
    └── src/
        ├── api/             → Axios API calls
        ├── components/      → Reusable UI components
        ├── pages/           → Page components
        ├── store/           → Redux store + slices
        └── styles/          → Global CSS
```
