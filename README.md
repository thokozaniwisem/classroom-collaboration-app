# classroom-collaboration-app
A simple **# Classroom Collaboration APP (MVP)** built with **React (Vite)** on the frontend and **Node.js + Express + SQLite** on the backend.  
This project allows **parents, teachers, and admins** to communicate, share updates, and manage student progress in a lightweight platform.

---

## Features

- User authentication (Admin, Parent, Teacher)
- Secure login with JWT
- Messaging between parents and teachers
- Admin dashboard for managing users
- Demo seed data for quick testing
- RESTful API backend with SQLite
- React frontend with Vite + Tailwind

---

## Tech Stack

**Frontend**
- React + Vite
- TailwindCSS
- Axios

**Backend**
- Node.js + Express
- SQLite (via better-sqlite3)
- JWT for authentication
- dotenv for environment variables

---

## Demo Accounts

After seeding, you can log in with:

- **Admin** → `admin@example.com` / `password123`  
- **Parent** → `parent@example.com` / `password123`  
- **Teacher** → `teacher@example.com` / `password123`

---

## Getting Started

Clone the repo:

```bash
git clone https://github.com/thokozaniwisem/classroom-collaboration-app
cd classroom-collaboration-app

Backend runs on http://localhost:4000

## Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on http://localhost:5173

## Project Structure

classroom-collaboration-app/
│── backend/        # Express + SQLite backend
│── frontend/       # React + Vite frontend
│── README.md       # Project documentation
│── SETUP.md        # Step-by-step setup guide

## Future Improvements

Real-time messaging (WebSockets)

Notifications system

File sharing (report cards, documents)

Role-based permissions

Replace SQLite with PostgreSQL or MongoDB for production


