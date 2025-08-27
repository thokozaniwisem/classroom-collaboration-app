# Classroom Collaboration App - Complete Setup Guide

Welcome! This guide will help you get the **Classroom Collaboration App** up and running on your local machine.  
No advanced knowledge is required. Screenshots and GIF placeholders are included to make things easy for beginners.

---

## Prerequisites

Before starting, make sure you have installed the following:

- **Node.js** (v16+ recommended)  
  [Download Node.js](https://nodejs.org/)  
  *Screenshot Placeholder:* ![Node.js install](path/to/screenshot.png)

- **npm** (comes with Node.js)  
  Check installation:  
  ```bash
  npm -v
git clone https://github.com/thokozaniwisem/classroom-collaboration-app
cd classroom-collaboration-app

  GIF Placeholder:
  
Step 2: Backend Setup
  
  1 Navigate to the backend folder: 
  cd backend

  2 Install dependencies:
  npm install

  Screenshot Placeholder:

  3 Copy the environment variables template and configure it:
  cp .env.example .env

  Open .env and set your JWT_SECRET (any random string for development)

  Screenshot Placeholder:

  4 Start the backend server:
  npm run dev

  The backend runs on: http://localhost:4000

  Optional: Seed demo users:
  curl -X POST http://localhost:4000/api/_seed

  Screenshot Placeholder:

Step 3: Frontend Setup

  1 Open a new terminal and navigate to the frontend folder:
  cd frontend

  2 Install dependencies:
  npm install

  Screenshot Placeholder:

  3 Start the frontend:
  npm run dev
  
  The frontend runs on: http://localhost:5173

  Open this URL in your browser to see the app.

GIF Placeholder:

Step 4: Login with Demo Accounts

After seeding, you can log in using these accounts:

| Role    | Email                                             | Password    |
| ------- | ------------------------------------------------- | ----------- |
| Admin   | [admin@example.com](mailto:admin@example.com)     | password123 |
| Teacher | [teacher@example.com](mailto:teacher@example.com) | password123 |
| Parent  | [parent@example.com](mailto:parent@example.com)   | password123 |

Screenshot Placeholder:

Step 5: Explore the App

  Admin: Manage users and view the dashboard
  
  Teacher: Post announcements, schedule meetings
  
  Parent: View announcements and student progress

GIF Placeholder:

Project Structure

classroom-collaboration-app/
│── backend/       # Express + SQLite backend
│   │── controllers/
│   │── models/
│   │── routes/
│   │── .env.example
│   │── package.json
│── frontend/      # React + Vite frontend
│   │── src/
│   │── index.html
│   │── package.json
│── README.md      # Project documentation
│── SETUP.md       # This complete guide
│── LICENSE        # MIT License


Next Steps / Future Improvements

  Real-time messaging using WebSockets
  
  Notifications system
  
  File sharing (report cards, documents)
  
  Role-based permissions
  
  Replace SQLite with PostgreSQL or MongoDB for production
  
Support
If you run into any issues:
  
  Open a GitHub issue in the repository
  
  Contact the project maintainer
  
  Check your Node.js and npm versions
  
  Ensure your backend is running before starting the frontend  

  
