import { useEffect, useState } from 'react'
import api from '../api'

export default function Notifications() {
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [eventId, setEventId] = useState('')
  const [events, setEvents] = useState([])

  // Load recent notifications and events (for dropdown)
  function load() {
    api.get('/notifications').then((r) => setList(r.data))
    api.get('/events').then((r) => setEvents(r.data))
  }

  useEffect(() => { load() }, [])

  // Admin-only: send a simulated notification
  async function send(e) {
    e.preventDefault()
    await api.post('/notifications', { message, eventId })
    setMessage('')
    load()
  }

  return (
    <div>
      <h2>Notifications</h2>
      <form onSubmit={send} className="card form" style={{ maxWidth: 560, marginBottom: 16 }}>
        <label className="form-field">
          <span className="label-text">Message</span>
          <input value={message} onChange={(e)=>setMessage(e.target.value)} required />
        </label>
        <label className="form-field">
          <span className="label-text">Event</span>
          <select value={eventId} onChange={(e)=>setEventId(e.target.value)} required>
            <option value="">Select event</option>
            {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
        </label>
        <button type="submit" className="btn primary">Send</button>
      </form>
      <ul className="list">
        {list.map(n => (
          <li key={n._id} className="card">
            <div style={{ fontWeight: 500 }}>{n.message}</div>
            <div className="muted">for {(typeof n.eventId === 'object' && n.eventId?.title) ? n.eventId.title : n.eventId}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}


