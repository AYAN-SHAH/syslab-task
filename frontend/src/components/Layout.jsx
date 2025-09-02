import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div className="container">
      <nav className="nav">
        <div className="brand">Syslab Events</div>
        {token && (
          <div className="nav-actions">
            <Link className="btn primary" to="/create">Create event</Link>
          </div>
        )}
        <div className="nav-links">
          <Link to="/">Events</Link>
          <Link to="/notifications">Notifications</Link>
        </div>
        <div className="spacer" />
        {token ? (
          <button className="btn outline" onClick={logout}>Logout</button>
        ) : (
          <Link className="btn" to="/login">Login</Link>
        )}
      </nav>
      <Outlet />
    </div>
  )
}


