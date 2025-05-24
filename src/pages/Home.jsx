import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-3 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-primary via-primary-light to-secondary p-3 rounded-2xl shadow-neu-light">
                <ApperIcon name="CheckSquare" className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">
                Organize • Track • Complete
              </p>
            </div>
          </motion.div>

          {/* Time Display */}
          <motion.div 
            className="hidden md:flex items-center space-x-4 card-neu px-6 py-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="h-5 w-5 text-primary" />
              <div className="text-right">
                <div className="text-lg font-bold text-surface-800 dark:text-surface-200">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-surface-600 dark:text-surface-400">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-700 dark:to-surface-800 shadow-neu-light hover:shadow-glow transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ rotate: 0 }}
            animate={{ rotate: darkMode ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {darkMode ? (
              <ApperIcon name="Sun" className="h-6 w-6 text-secondary group-hover:text-secondary-light transition-colors" />
            ) : (
              <ApperIcon name="Moon" className="h-6 w-6 text-primary group-hover:text-primary-light transition-colors" />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-800 dark:text-surface-100 mb-4 text-balance">
              Transform Your 
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Productivity</span>
            </h2>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto text-balance">
              Effortlessly organize, prioritize, and complete your tasks with our innovative task management system
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {[
              { icon: "Plus", title: "Quick Add", desc: "Create tasks instantly" },
              { icon: "Filter", title: "Smart Filter", desc: "Find tasks effortlessly" },
              { icon: "TrendingUp", title: "Track Progress", desc: "Monitor completion" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="card-neu p-6 group hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
                    <ApperIcon name={feature.icon} className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-surface-800 dark:text-surface-200 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-600 dark:text-surface-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Feature Component */}
      <motion.section 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 pb-12"
      >
        <MainFeature />
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 mt-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="card-neu p-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" className="h-5 w-5 text-accent" />
                <span className="text-surface-600 dark:text-surface-400">Made with passion for productivity</span>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-surface-500 dark:text-surface-500">© 2024 TaskFlow</span>
                <div className="flex space-x-4">
                  {["Github", "Twitter", "Mail"].map((icon, index) => (
                    <motion.div
                      key={icon}
                      className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name={icon} className="h-4 w-4" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home