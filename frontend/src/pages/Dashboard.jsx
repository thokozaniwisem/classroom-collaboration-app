import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}.</p>
          <p>Your role: {user.role}</p>
          <p>Use the navigation to access announcements and meetings.</p>
        </div>
      ) : (
        <p>Please log in to continue.</p>
      )}
    </div>
  )
}
