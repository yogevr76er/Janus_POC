import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding.jsx'
import Dashboard from './components/Dashboard.jsx'
import AuthRequest from './components/AuthRequest.jsx'

// API URL - שנה בהתאם ל-Render URL שלך
const API_URL = 'https://janus-poc.onrender.com/api'

function App() {
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState('')
  const [pendingAuth, setPendingAuth] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('janus_userId')
    const storedUserName = localStorage.getItem('janus_userName')
    
    if (storedUserId) {
      setUserId(storedUserId)
      setUserName(storedUserName || '')
    }
    
    setIsLoading(false)
  }, [])

  // Poll for pending auth requests
  useEffect(() => {
    if (!userId) return

    const checkPendingAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/pending/${userId}`)
        const data = await response.json()
        
        if (data && data.id && data.status === 'pending') {
          setPendingAuth(data)
        } else {
          setPendingAuth(null)
        }
      } catch (error) {
        console.error('Error checking pending auth:', error)
      }
    }

    // Check immediately
    checkPendingAuth()

    // Then check every 3 seconds
    const interval = setInterval(checkPendingAuth, 3000)

    return () => clearInterval(interval)
  }, [userId])

  const handleOnboardingComplete = (newUserId, newUserName) => {
    setUserId(newUserId)
    setUserName(newUserName)
    localStorage.setItem('janus_userId', newUserId)
    localStorage.setItem('janus_userName', newUserName)
  }

  const handleAuthComplete = () => {
    setPendingAuth(null)
  }

  const handleLogout = () => {
    setUserId(null)
    setUserName('')
    localStorage.removeItem('janus_userId')
    localStorage.removeItem('janus_userName')
    localStorage.removeItem('janus_credentialId')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  // Show pending auth request if exists
  if (pendingAuth) {
    return (
      <AuthRequest 
        request={pendingAuth}
        userName={userName}
        onComplete={handleAuthComplete}
        apiUrl={API_URL}
      />
    )
  }

  // Show onboarding if no user
  if (!userId) {
    return <Onboarding onComplete={handleOnboardingComplete} apiUrl={API_URL} />
  }

  // Show dashboard
  return <Dashboard userName={userName} userId={userId} onLogout={handleLogout} apiUrl={API_URL} />
}

export default App
