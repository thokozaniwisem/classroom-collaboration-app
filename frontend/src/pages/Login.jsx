import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('parent')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError(null)
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email.split('@')[0], email, password, role })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogin = async () => {
    setError(null)
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login or Register</h2>
      <div>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={handleLogin} style={{ marginRight: 8 }}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <hr />
      <div>
        For demo: use teacher@example.com or parent@example.com with password "password" after running backend seed.
      </div>
    </div>
  )
}
