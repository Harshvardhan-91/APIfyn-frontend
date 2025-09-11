import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PaymentProvider } from './contexts/PaymentContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthNavbar from './components/AuthNavbar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import WorkflowTemplates from './components/WorkflowTemplates'
import HowItWorks from './components/HowItWorks'
import WorkflowCreationGuide from './components/WorkflowCreationGuide'
import PricingComponent from './components/Pricing'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Workflows from './pages/Workflows'
import Integrations from './pages/Integrations'
import Analytics from './pages/Analytics'
import Templates from './pages/Templates'
import WorkflowBuilder from './pages/WorkflowBuilder'
import WorkflowDetail from './pages/WorkflowDetail'
import Pricing from './pages/Pricing'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsAndConditions from './pages/TermsAndConditions'
import ShippingDelivery from './pages/ShippingDelivery'
import ContactUs from './pages/ContactUs'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero/>
      <div className="mx-[5%]">
        <Features />
        <WorkflowTemplates />
        <WorkflowCreationGuide />
        <PricingComponent />
      </div>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <PaymentProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Pricing />
              </div>
            } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/shipping-delivery" element={<ShippingDelivery />} />
          <Route path="/contact-us" element={<ContactUs />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Dashboard />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/workflows" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Workflows />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/workflows/create" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <WorkflowBuilder />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/workflows/:id" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <WorkflowDetail />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/workflows/:id/edit" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <WorkflowBuilder />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/integrations" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Integrations />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/analytics" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Analytics />
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/templates" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AuthNavbar />
                <Templates />
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
      </PaymentProvider>
    </AuthProvider>
  )
}

export default App;