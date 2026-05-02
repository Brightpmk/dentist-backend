# Dentist Appointment Management System - Backend

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/c1cqHQ5R)

A robust RESTful API built with Node.js, Express, and MongoDB for managing dentist appointments. This backend provides advanced authentication, role-based access control, and scalable data management.

## 🚀 Key Features

- **Advanced Authentication**: JWT-based security with HTTP-only cookie support.
- **RBAC (Role-Based Access Control)**: Custom middleware to manage `User` and `Admin` permissions.
- **MVC Architecture**: Structured codebase for high maintainability across Controllers, Models, and Routes.
- **Advanced Querying**: Built-in support for filtering, sorting, selecting fields, and pagination on API endpoints.
- **Data Integrity**: Comprehensive Mongoose schemas with strict validation and cascade deletes.
- **Security**: Password hashing with BcryptJS and protection against common vulnerabilities.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Security**: JSON Web Tokens (JWT), BcryptJS, Cookie-parser
- **Environment**: Dotenv
- **Deployment**: Optimized for Vercel

## 📂 Project Structure

```text
├── config/             # Database & Environment configuration
├── controllers/        # Business logic for Auth, Dentists, Bookings, and Users
├── middleware/         # Custom Auth and Error handling middleware
├── models/             # Mongoose schemas (User, Dentist, Booking)
├── routes/             # API route definitions
└── server.js           # Entry point of the application
```

## 🚦 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and receive JWT in cookie
- `GET /api/v1/auth/logout` - Clear authentication cookie
- `GET /api/v1/auth/me` - Get current logged-in user profile
- `PUT /api/v1/auth/update-me` - Update profile details
- `PUT /api/v1/auth/change-password` - Update password

### Dentists (Public/Admin)
- `GET /api/v1/dentists` - Get all dentists (Supports filtering, sorting, pagination)
- `GET /api/v1/dentists/:id` - Get single dentist details
- `POST /api/v1/dentists` - Add new dentist (Admin only)
- `PUT /api/v1/dentists/:id` - Update dentist info (Admin only)
- `DELETE /api/v1/dentists/:id` - Delete dentist (Admin only)

### Bookings (Private)
- `GET /api/v1/bookings` - Get all bookings (Admin sees all, User sees own)
- `GET /api/v1/bookings/:id` - Get specific booking
- `POST /api/v1/dentists/:dentistId/bookings` - Create a new booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Cancel booking

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Brightpmk/dentist-backend
   cd dentist-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `config/config.env` file and add the following:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📄 License
This project is licensed under the ISC License.
