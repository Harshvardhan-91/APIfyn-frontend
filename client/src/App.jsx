import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthNavbar from './components/AuthNavbar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import WorkflowTemplates from './components/WorkflowTemplates'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero/>
      <div className="mx-[5%]">
        <Features />
        <WorkflowTemplates />
        <HowItWorks />
        <Pricing />
      </div>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Profile />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Settings />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;