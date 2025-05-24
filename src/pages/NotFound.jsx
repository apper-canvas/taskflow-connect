import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary to-secondary shadow-neu-light mb-6">
            <ApperIcon name="AlertTriangle" className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-800 dark:text-surface-200 mb-4">
            Page Not Found
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 text-lg">
            Oops! The page you're looking for seems to have wandered off. Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <Link to="/">
            <motion.button
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Home" className="h-5 w-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-surface-100 dark:bg-surface-700 rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              onClick={() => window.history.back()}
            >
              <ApperIcon name="ArrowLeft" className="h-4 w-4" />
              <span className="text-surface-700 dark:text-surface-300">Go Back</span>
            </motion.button>
            
            <motion.button
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-surface-100 dark:bg-surface-700 rounded-xl shadow-soft hover:shadow-card transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              onClick={() => window.location.reload()}
            >
              <ApperIcon name="RefreshCw" className="h-4 w-4" />
              <span className="text-surface-700 dark:text-surface-300">Refresh</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 p-6 card-neu"
        >
          <h3 className="font-semibold text-surface-800 dark:text-surface-200 mb-3">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "CheckSquare", label: "Task Manager", path: "/" },
              { icon: "Settings", label: "Settings", path: "/" },
              { icon: "HelpCircle", label: "Help", path: "/" },
              { icon: "Mail", label: "Contact", path: "/" }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="flex items-center space-x-2 p-3 rounded-lg bg-surface-50 dark:bg-surface-600 hover:bg-primary hover:text-white transition-all duration-300 group"
              >
                <ApperIcon name={link.icon} className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound