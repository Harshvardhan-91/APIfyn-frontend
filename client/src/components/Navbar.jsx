import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, Zap, ArrowRight, Bell, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigate to dashboard when user becomes available after login
  useEffect(() => {
    if (user && isLoggingIn) {
      setIsLoggingIn(false)
      navigate('/dashboard')
    }
  }, [user, isLoggingIn, navigate])

  const handleSignIn = async () => {
    try {
      setIsLoggingIn(true)
      await login()
      // Navigation will be handled by useEffect
    } catch (error) {
      console.error('Error signing in:', error)
      setIsLoggingIn(false)
    }
  }

  const handleGetStarted = async () => {
    try {
      if (user) {
        navigate('/dashboard')
      } else {
        setIsLoggingIn(true)
        await login()
        // Navigation will be handled by useEffect
      }
    } catch (error) {
      console.error('Error in get started:', error)
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
  }

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How it Works', href: '#how-it-works' }
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/60' 
          : 'bg-white/90 backdrop-blur-lg border-b border-gray-100/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                FlowAPI
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">Workflow Automation</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-4 py-2 text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-50 font-medium"
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">2</span>
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || 'User'} 
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-gray-200 ${user.photoURL ? 'hidden' : 'flex'}`}>
                      <span className="text-white text-sm font-medium">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                      >
                        <button
                          onClick={() => { navigate('/dashboard'); setProfileOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          Settings
                        </button>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  className="px-5 py-2.5 text-gray-700 hover:text-gray-900 transition-all duration-200 font-semibold rounded-xl hover:bg-gray-50/80 backdrop-blur-sm"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 12px 30px -5px rgba(59, 130, 246, 0.4)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetStarted}
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-semibold overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2 border-t border-gray-100">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-lg font-medium"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <div className="pt-4 space-y-3 border-t border-gray-100">
                  {user ? (
                    <>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                        className="block w-full px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-lg font-medium text-left"
                      >
                        Dashboard
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => { navigate('/profile'); setIsOpen(false); }}
                        className="block w-full px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-lg font-medium text-left"
                      >
                        Profile
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        onClick={handleLogout}
                        className="block w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 rounded-lg font-medium text-left"
                      >
                        Sign Out
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={handleSignIn}
                        className="block w-full px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 rounded-lg font-medium text-left"
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleGetStarted}
                        className="flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar;