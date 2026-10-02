# EduLearn Backend API

Production-ready RESTful backend built with **Node.js**, **Express.js**, and **MySQL** for the EduLearn online learning platform (supporting Flutter mobile, desktop, and web applications).

---

## 🚀 Features

- **Express.js & Modular Clean Architecture**: Decoupled routes, controllers, services, and middlewares.
- **MySQL Relational Database**: 19 normalized relational tables with foreign keys, indexes, cascade deletions, and UTF-8 collation.
- **JWT Authentication**: Access token & refresh token rotation with bcrypt password hashing.
- **Full API Parity with EduLearn Flutter App**: Endpoints perfectly match `ApiConstants` and `ApiResponse<T>` wrappers.
- **Dual-Mode Resilient Database Layer**: Direct MySQL querying when online, plus resilient fallback to rich in-memory mock datasets if MySQL is temporarily offline.
- **Database Migrations & Seeders**: One-command database creator (`npm run db:init`) that sets up tables and imports 20 courses, 54 lessons, 10 quizzes, 10 assignments, categories, instructors, and student profiles.
- **Comprehensive Automated Test Suite**: 33 tests verifying all authentication, courses, lessons, quizzes, assignments, enrollments, certificates, and profiles.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (>= 18.x)
- **Framework**: Express.js 4.x
- **Database**: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
- **Driver**: `mysql2` with Promise Pool
- **Auth**: `jsonwebtoken`, `bcryptjs`
- **Security & Performance**: `helmet`, `cors`, `compression`, `morgan`

---

## 📂 Project Structure

```text
Backend/
├── .env                  # Active environment variables
├── .env.example          # Template environment file
├── package.json          # Node dependencies and scripts
├── schema.sql            # Full MySQL database DDL (19 tables)
├── seed.sql              # Full SQL seed data
├── README.md             # Documentation
└── src/
    ├── app.js            # Express app configuration & middlewares
    ├── server.js         # HTTP server entrypoint
    ├── config/
    │   ├── database.js   # MySQL2 connection pool & health diagnostics
    │   └── env.js        # Environment variables parser
    ├── middleware/
    │   ├── auth.middleware.js   # JWT verification middleware
    │   └── error.middleware.js  # Global error & 404 handlers
    ├── utils/
    │   └── apiResponse.js       # Standard ApiResponse envelope
    ├── services/                # Business logic & MySQL / fallback queries
    │   ├── auth.service.js
    │   ├── course.service.js
    │   ├── category.service.js
    │   ├── enrollment.service.js
    │   ├── lesson.service.js
    │   ├── quiz.service.js
    │   ├── assignment.service.js
    │   ├── progress.service.js
    │   ├── profile.service.js
    │   ├── notification.service.js
    │   ├── favorite.service.js
    │   └── store.service.js
    ├── controllers/             # Request & response controllers
    │   ├── auth.controller.js
    │   ├── course.controller.js
    │   ├── category.controller.js
    │   ├── enrollment.controller.js
    │   ├── lesson.controller.js
    │   ├── quiz.controller.js
    │   ├── assignment.controller.js
    │   ├── progress.controller.js
    │   ├── profile.controller.js
    │   ├── notification.controller.js
    │   └── favorite.controller.js
    ├── routes/                  # Express route definitions
    │   ├── index.js             # Master API router (/api/v1)
    │   ├── auth.routes.js
    │   ├── course.routes.js
    │   ├── category.routes.js
    │   ├── enrollment.routes.js
    │   ├── lesson.routes.js
    │   ├── quiz.routes.js
    │   ├── assignment.routes.js
    │   ├── progress.routes.js
    │   ├── certificate.routes.js
    │   ├── profile.routes.js
    │   ├── notification.routes.js
    │   └── favorite.routes.js
    ├── data/
    │   └── seedData.json        # Parsed fixture data
    └── scripts/
        ├── initDb.js            # Automated MySQL database & schema migration
        ├── generateSeeds.js     # Fixture & seed.sql generator
        └── testApi.js           # 33-test automated API test suite
```

---

## 🗄️ Database Schema (19 Tables)

| Table | Purpose |
|---|---|
| `users` | User credentials, emails, bcrypt password hashes, and roles (`student`, `instructor`, `admin`) |
| `students` | Detailed student profile (ID code, phone, education level, birth date) |
| `instructors` | Instructor profiles (title, biography, avatar URL) |
| `categories` | Course categories (name, description, icon URL) |
| `courses` | Course catalog (pricing, ratings, duration, level, instructor/category foreign keys) |
| `lessons` | Lessons per course (video URLs, ordering, lock status) |
| `materials` | Downloadable lesson resources (PDFs, file sizes, URLs) |
| `quizzes` | Lesson quizzes (passing scores, time limits, attempt limits) |
| `questions` | Quiz questions (options JSON, correct answer index, explanations) |
| `quiz_attempts` | Student quiz submission attempts (scores, percentages, answers) |
| `assignments` | Course assignments (instructions, due dates, maximum scores) |
| `assignment_submissions` | Student submissions (files, text, grading, comments) |
| `enrollments` | Student course enrollments & active progress |
| `lesson_completions` | Completed lessons per student |
| `course_progress` | Overall progress tracking (% completion, quiz count, assignment count) |
| `certificates` | Issued certificates with unique certificate verification codes |
| `learning_activities` | Student activity timeline and audit log |
| `notifications` | User notifications and read status |
| `user_favorites` | Bookmarked / saved courses |

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **MySQL Server** (via XAMPP, Laragon, Docker, or native Windows MySQL)

### 2. Configure Environment (`.env`)
Create or edit `.env`:
```env
PORT=8080
NODE_ENV=development

# MySQL Database Settings
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=edulearn_db
DB_CONNECTION_LIMIT=10

# JWT Auth
JWT_SECRET=edulearn_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=edulearn_refresh_token_secret_key_2026
JWT_REFRESH_EXPIRES_IN=30d
```

### 3. Initialize MySQL Database & Seed Data
Ensure MySQL is started, then run:
```bash
npm run db:init
```
This command automatically:
1. Connects to MySQL and executes `CREATE DATABASE IF NOT EXISTS edulearn_db`.
2. Runs `schema.sql` to generate all 19 relational tables with indexes and foreign keys.
3. Runs `seed.sql` to populate courses, instructors, lessons, quizzes, and initial accounts.

*(Optional Docker shortcut to start MySQL)*:
```bash
docker run --name mysql-edulearn -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -e MYSQL_DATABASE=edulearn_db -p 3306:3306 -d mysql:8.0
```

### 4. Run Server
```bash
# Production mode
npm start

# Development mode with live reload
npm run dev
```
The server will start on: **`http://localhost:8080`**

### 5. Run API Tests
```bash
npm test
```
Runs 33 automated tests validating all endpoints, status codes, and JSON response formats.

---

## 📱 Connecting the Flutter App

In the Flutter project `E-learning`:

1. Open `E-learning/lib/app/config/app_config.dart`.
2. Toggle `useFakeApi`:
   ```dart
   class AppConfig {
     static const String appName = 'EduLearn';
     static const String appVersion = '1.0.0';

     // Change this to false to connect to your live Express.js + MySQL backend!
     static bool useFakeApi = false;
   }
   ```
3. Run the Flutter app:
   ```bash
   flutter run -d chrome
   # or
   flutter run -d windows
   ```
   *(For Android Emulator, change `baseUrl` in `lib/app/config/api_config.dart` to `http://10.0.2.2:8080`)*.

---

## 🔑 Default Seed Accounts

All default accounts are pre-seeded with password: `password123`

| Role | Email | Password |
|---|---|---|
| **Student** | `student@edulearn.com` | `password123` |
| **Instructor** | `instructor@edulearn.com` | `password123` |
| **Admin** | `admin@edulearn.com` | `password123` |

---

## 📚 API Endpoints Reference

All endpoints return the standardized envelope:
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2026-10-02T18:40:00.000Z"
}
```

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login` — Login user (body: `{ email, password }`)
- `POST /api/v1/auth/register` — Register student (body: `{ fullName, email, password, phoneNumber }`)
- `POST /api/v1/auth/logout` — Logout user
- `POST /api/v1/auth/refresh-token` — Refresh access token
- `POST /api/v1/auth/change-password` — Change password (body: `{ currentPassword, newPassword }`)
- `GET /api/v1/auth/me` — Get current user profile (Header: `Authorization: Bearer <token>`)

### Courses (`/api/v1/courses`)
- `GET /api/v1/courses` — Get all published courses
- `GET /api/v1/courses/:id` — Get course details
- `GET /api/v1/courses/search?q=...&categoryId=...&level=...&sortBy=...` — Search & filter courses
- `GET /api/v1/courses/popular` — Get popular courses
- `GET /api/v1/courses/recommended` — Get recommended courses
- `GET /api/v1/courses/:courseId/lessons` — Get course lessons
- `GET /api/v1/courses/:courseId/assignments` — Get course assignments

### Categories (`/api/v1/categories`)
- `GET /api/v1/categories` — Get all categories with course count
- `GET /api/v1/categories/:id/courses` — Get courses in category

### Enrollments (`/api/v1/enrollments`)
- `POST /api/v1/enrollments/enroll` — Enroll student in course (body: `{ courseId, studentId }`)
- `GET /api/v1/enrollments/my?studentId=...` — Get enrolled courses
- `GET /api/v1/enrollments/check?courseId=...&studentId=...` — Check enrollment status
- `GET /api/v1/enrollments/detail?courseId=...&studentId=...` — Get enrollment record

### Lessons (`/api/v1/lessons`)
- `GET /api/v1/lessons/:id` — Get lesson details with materials
- `POST /api/v1/lessons/:id/complete` — Mark lesson as completed
- `GET /api/v1/lessons/:lessonId/quiz` — Get quiz for lesson

### Quizzes (`/api/v1/quizzes`)
- `GET /api/v1/quizzes/:id` — Get quiz details with questions
- `POST /api/v1/quizzes/:id/submit` — Submit quiz attempt and grade answers
- `GET /api/v1/quizzes/:id/attempts` — Get attempts for quiz

### Assignments (`/api/v1/assignments`)
- `GET /api/v1/assignments/:id` — Get assignment details
- `POST /api/v1/assignments/:id/submit` — Submit assignment solution
- `GET /api/v1/assignments/:id/submissions/my?studentId=...` — Get student submission

### Progress & Certificates (`/api/v1/progress` & `/api/v1/certificates`)
- `GET /api/v1/progress/courses/:courseId?studentId=...` — Get course completion progress
- `GET /api/v1/progress/history?studentId=...` — Get student learning timeline
- `GET /api/v1/certificates?studentId=...` — Get earned certificates
- `GET /api/v1/certificates/:id` — Get certificate by ID

### Profile (`/api/v1/profile`)
- `GET /api/v1/profile?studentId=...` — Get student profile
- `PUT /api/v1/profile/update` — Update student profile

### Notifications (`/api/v1/notifications`)
- `GET /api/v1/notifications?userId=...` — Get notifications
- `PUT /api/v1/notifications/:id/read` — Mark notification read
- `PUT /api/v1/notifications/read-all?userId=...` — Mark all notifications read

### Favorites (`/api/v1/favorites`)
- `GET /api/v1/favorites?userId=...` — Get bookmarked courses
- `POST /api/v1/favorites/:courseId` — Bookmark course
- `DELETE /api/v1/favorites/:courseId` — Remove bookmark

### Health Check (`/api/v1/health`)
- `GET /api/v1/health` — Check server & database connectivity
