import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Meetings() {
  const { user, token } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [teacherId, setTeacherId] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(null)

  const fetchMeetings = async () => {
    if (!token) return
    const res = await fetch('http://localhost:4000/api/meetings', { headers: { Authorization: `Bearer ${token}` }})
    const data = await res.json()
    setMeetings(data)
  }

  useEffect(() => {
    fetchMeetings()
  }, [token])

  const requestMeeting = async () => {
    setError(null)
    try {
      const res = await fetch('http://localhost:4000/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ teacher_id: teacherId, date })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setTeacherId(''); setDate('')
      fetchMeetings()
    } catch (err) {
      setError(err.message)
    }
  }

  const updateMeeting = async (id, status) => {
    setError(null)
    try {
      const res = await fetch(`http://localhost:4000/api/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      fetchMeetings()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Meetings</h2>
      {user && user.role === 'parent' && (
        <div style={{ marginBottom: 20 }}>
          <h3>Request a meeting</h3>
          <div><input placeholder="Teacher ID (use 1 for demo teacher)" value={teacherId} onChange={e => setTeacherId(e.target.value)} /></div>
          <div><input placeholder="YYYY-MM-DD HH:mm" value={date} onChange={e => setDate(e.target.value)} /></div>
          <button onClick={requestMeeting}>Request</button>
        </div>
      )}

      <div>
        {meetings.map(m => (
          <div key={m.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8 }}>
            <div>With: {user.role === 'teacher' ? m.parent_name : m.teacher_name}</div>
            <div>Date: {m.date}</div>
            <div>Status: {m.status}</div>
            {user.role === 'teacher' && (
              <div>
                <button onClick={() => updateMeeting(m.id, 'approved')} style={{ marginRight: 6 }}>Approve</button>
                <button onClick={() => updateMeeting(m.id, 'declined')}>Decline</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
