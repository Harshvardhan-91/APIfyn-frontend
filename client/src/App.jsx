import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import WorkflowTemplates from './components/WorkflowTemplates'
import HowItWorks from './components/HowItWorks'
import Pricing from './components/Pricing'
import Footer from './components/Footer'

const App = () => {
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

export default App;