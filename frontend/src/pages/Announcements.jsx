import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const { user, token } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState(null)

  const fetchAnnouncements = async () => {
    const res = await fetch('http://localhost:4000/api/announcements')
    const data = await res.json()
    setAnnouncements(data)
  }

  useEffect(() => { fetchAnnouncements() }, [])

  const handlePost = async () => {
    setError(null)
    try {
      const res = await fetch('http://localhost:4000/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
        body: JSON.stringify({ title, content })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed')
      }
      setTitle(''); setContent('')
      fetchAnnouncements()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Announcements</h2>
      {user && user.role === 'teacher' && (
        <div style={{ marginBottom: 20 }}>
          <h3>Post announcement</h3>
          <div><input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div><textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} /></div>
          <button onClick={handlePost}>Post</button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
      )}
      <div>
        {announcements.map(a => (
          <div key={a.id} style={{ border: '1px solid #ddd', padding: 10, marginBottom: 8 }}>
            <div style={{ fontWeight: 'bold' }}>{a.title}</div>
            <div>{a.content}</div>
            <div style={{ fontSize: 12, color: '#666' }}>By {a.teacher_name} on {new Date(a.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
