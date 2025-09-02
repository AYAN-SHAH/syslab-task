import { Routes, Route } from 'react-router-dom'
import EventsList from './pages/EventsList.jsx'
import EventDetails from './pages/EventDetails.jsx'
import CreateEvent from './pages/CreateEvent.jsx'
import Login from './pages/Login.jsx'
import Notifications from './pages/Notifications.jsx'
import { Helmet } from 'react-helmet-async'
import Layout from './components/Layout.jsx'

function App() {
  return (
    <>
      <Helmet>
        <title>Syslab Events</title>
        <meta name="description" content="Event management app: create, view, and notify" />
      </Helmet>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<EventsList />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </>
  )
}

export default App


