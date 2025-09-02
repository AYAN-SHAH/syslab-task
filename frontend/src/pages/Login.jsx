import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Login() {
  const [email, setEmail] = useState('admin@syslab.local')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Exchange credentials for JWT and store in localStorage
  async function submit(e) {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/create')
    } catch (e) {
      setError('Invalid credentials')
    }
  }

  return (
    <form onSubmit={submit} className="card form" style={{ maxWidth: 480 }}>
      <h3>Admin Login</h3>
      {error && <div className="error">{error}</div>}
      <label className="form-field">
        <span className="label-text">Email</span>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      </label>
      <label className="form-field">
        <span className="label-text">Password</span>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      </label>
      <button type="submit" className="btn primary" style={{ marginTop: 8 }}>Login</button>
    </form>
  )
}


