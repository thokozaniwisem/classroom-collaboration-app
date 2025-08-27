import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Announcements from './pages/Announcements'
import Dashboard from './pages/Dashboard'
import Meetings from './pages/Meetings'
import { AuthProvider, useAuth } from './context/AuthContext'

function App() {
  const { user, logout } = useAuth();
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <header style={{ marginBottom: 20 }}>
        <nav>
          <Link to="/" style={{ marginRight: 10 }}>Home</Link>
          <Link to="/announcements" style={{ marginRight: 10 }}>Announcements</Link>
          <Link to="/meetings" style={{ marginRight: 10 }}>Meetings</Link>
          {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </nav>
        {user && <div>Signed in as {user.name} ({user.role})</div>}
      </header>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/meetings" element={<Meetings />} />
      </Routes>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)
