import { useEffect, useState } from 'react'
import api from '../api'
import EventCard from '../components/EventCard.jsx'
import { } from '@chakra-ui/react'
import EmptyState from '../components/EmptyState.jsx'

export default function EventsList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Load all events on mount
  useEffect(() => {
    api.get('/events').then((res) => setEvents(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h2>Events</h2>
      {events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>No events yet</div>
      ) : (
        <ul className="list">
          {events.map((ev) => (<EventCard key={ev._id} ev={ev} />))}
        </ul>
      )}
    </div>
  )
}


