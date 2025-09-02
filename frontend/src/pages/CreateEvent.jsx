import { useState } from 'react'
import api from '../api'
import FormField from '../components/FormField.jsx'

const zones = [
  'UTC',
  'Asia/Karachi',
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin'
]

export default function CreateEvent() {
  const [form, setForm] = useState({ title: '', description: '', date: '', timezone: 'UTC', image: null })
  const [msg, setMsg] = useState('')

  // Handle simple input and file selection
  function onChange(e) {
    const { name, value, files } = e.target
    if (name === 'image') setForm((f) => ({ ...f, image: files[0] }))
    else setForm((f) => ({ ...f, [name]: value }))
  }

  // Submit multipart/form-data to backend (requires admin token)
  async function submit(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    fd.append('date', form.date)
    fd.append('timezone', form.timezone)
    if (form.image) fd.append('image', form.image)
    await api.post('/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    setMsg('Event created')
    setForm({ title: '', description: '', date: '', timezone: 'UTC', image: null })
  }

  return (
    <form onSubmit={submit} className="card form">
      <h3>Create Event</h3>
      {msg && <div className="success">{msg}</div>}
      <FormField label="Title">
        <input name="title" value={form.title} onChange={onChange} required />
      </FormField>
      <FormField label="Description">
        <textarea name="description" value={form.description} onChange={onChange} rows="4" />
      </FormField>
      <FormField label="Date/Time" hint="ISO like 2025-09-03T18:00">
        <input name="date" value={form.date} onChange={onChange} required />
      </FormField>
      <FormField label="Timezone">
        <select name="timezone" value={form.timezone} onChange={onChange}>{zones.map(z => <option key={z} value={z}>{z}</option>)}</select>
      </FormField>
      <FormField label="Image">
        <input type="file" name="image" accept="image/*" onChange={onChange} />
      </FormField>
      <button type="submit" className="btn primary">Create</button>
    </form>
  )
}


