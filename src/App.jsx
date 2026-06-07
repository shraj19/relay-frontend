import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import AppView from './pages/AppView.jsx'
import Profile from './pages/Profile.jsx'
import CreateConversation from './pages/CreateConversation.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />

      {/* Protected */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path='/create-conversation' element={
        <ProtectedRoute>
          <CreateConversation />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App