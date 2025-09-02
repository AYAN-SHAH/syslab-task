import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'

export default function EventCard({ ev }) {
  return (
    <li className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {ev.imageUrl && <img src={ev.imageUrl} alt="event" className="thumb" />}
      <div className="event-content">
        <Link to={`/events/${ev._id}`} className="title">{ev.title}</Link>
        <div className="muted">
          {DateTime.fromISO(ev.dateUtc, { zone: 'utc' }).setZone(ev.timezone).toFormat('ccc, dd LLL yyyy • t')} ({ev.timezone})
        </div>
      </div>
    </li>
  )
}


