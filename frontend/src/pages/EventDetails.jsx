import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { DateTime } from 'luxon'
import { } from '@chakra-ui/react'

export default function EventDetails() {
  const { id } = useParams()
  const [ev, setEv] = useState(null)
  const navigate = useNavigate()

  // Fetch single event by id
  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setEv(res.data))
  }, [id])

  if (!ev) return <p>Loading...</p>

  // Admin-only delete
  async function del() {
    if (!confirm('Delete event?')) return
    await api.delete(`/events/${id}`)
    navigate('/')
  }

  return (
    <div>
      <h2>{ev.title}</h2>
      {ev.imageUrl && (
        <img
          src={ev.imageUrl}
          alt="event"
          className="banner"
          style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
        />
      )}
      <p>{ev.description}</p>
      <p className="muted">{DateTime.fromISO(ev.dateUtc, { zone: 'utc' }).setZone(ev.timezone).toFormat('ffff')} ({ev.timezone})</p>
      <button className="btn danger" onClick={del}>Delete</button>
    </div>
  )
}


