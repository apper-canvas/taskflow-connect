import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, startOfWeek, endOfWeek, subDays } from 'date-fns'
import ApperIcon from '../components/ApperIcon'

function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [recentActivity, setRecentActivity] = useState([])

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)
      
      // Generate recent activity from tasks
      const activity = parsedTasks
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5)
        .map(task => ({
          id: task.id,
          type: task.status === 'completed' ? 'completed' : 'created',
          task: task.title,
          time: task.updatedAt || task.createdAt,
          priority: task.priority
        }))
      setRecentActivity(activity)
    }
  }, [])

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const overdue = tasks.filter(t => 
      t.status === 'pending' && t.dueDate && isPast(new Date(t.dueDate))
    ).length
    
    const dueToday = tasks.filter(t => 
      t.dueDate && isToday(new Date(t.dueDate))
    ).length
    
    const dueTomorrow = tasks.filter(t => 
      t.dueDate && isTomorrow(new Date(t.dueDate))
    ).length
    
    const thisWeek = tasks.filter(t => {
      if (!t.dueDate) return false
      const dueDate = new Date(t.dueDate)
      const weekStart = startOfWeek(new Date())
      const weekEnd = endOfWeek(new Date())
      return dueDate >= weekStart && dueDate <= weekEnd
    }).length
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    
    const priorityBreakdown = {
      urgent: tasks.filter(t => t.priority === 'urgent').length,
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    }
    
    return { 
      total, completed, pending, overdue, dueToday, dueTomorrow, 
      thisWeek, completionRate, priorityBreakdown 
    }
  }

  const getProductivityTrend = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const completedOnDate = tasks.filter(t => 
        t.status === 'completed' && 
        t.updatedAt && 
        format(new Date(t.updatedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      ).length
      
      last7Days.push({
        date: format(date, 'MMM d'),
        completed: completedOnDate,
        isToday: isToday(date)
      })
    }
    return last7Days
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-task':
        toast.info('Redirecting to task creation...')
        // Navigate to main page with form open
        window.location.href = '/#add-task'
        break
      case 'view-overdue':
        toast.info('Showing overdue tasks...')
        window.location.href = '/#filter=overdue'
        break
      case 'view-today':
        toast.info('Showing today\'s tasks...')
        window.location.href = '/#filter=today'
        break
      default:
        break
    }
  }

  const stats = getTaskStats()
  const productivity = getProductivityTrend()
  const maxCompleted = Math.max(...productivity.map(d => d.completed), 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-primary-900">
      {/* Header */}
      <motion.header 
        className="bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <ApperIcon name="BarChart3" className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-surface-800 dark:text-surface-200">
                  Dashboard
                </h1>
              </motion.div>
            </div>
            
            <nav className="flex items-center gap-4">
              <Link 
                to="/" 
                className="px-4 py-2 text-surface-600 dark:text-surface-400 hover:text-primary font-medium transition-colors"
              >
                Tasks
              </Link>
              <motion.button
                onClick={() => handleQuickAction('add-task')}
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Task
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-surface-800 dark:text-surface-200 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-surface-600 dark:text-surface-400">
            Here's an overview of your task management progress
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              title: 'Total Tasks',
              value: stats.total,
              icon: 'CheckSquare',
              color: 'primary',
              change: '+2 this week'
            },
            {
              title: 'Completion Rate',
              value: `${stats.completionRate}%`,
              icon: 'TrendingUp',
              color: 'green-600',
              change: stats.completionRate > 70 ? 'Great progress!' : 'Keep going!'
            },
            {
              title: 'Due Today',
              value: stats.dueToday,
              icon: 'Calendar',
              color: 'yellow-600',
              change: stats.dueToday > 0 ? 'Focus time!' : 'All clear!'
            },
            {
              title: 'Overdue',
              value: stats.overdue,
              icon: 'AlertTriangle',
              color: 'red-600',
              change: stats.overdue === 0 ? 'Well done!' : 'Needs attention'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="card-neu p-6 group hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-all duration-300`}>
                  <ApperIcon name={stat.icon} className={`h-6 w-6 text-${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold text-${stat.color}`}>
                  {stat.value}
                </div>
              </div>
              <h3 className="font-semibold text-surface-800 dark:text-surface-200 mb-1">
                {stat.title}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {stat.change}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productivity Chart */}
          <motion.div 
            className="lg:col-span-2 card-neu p-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-surface-800 dark:text-surface-200 mb-6">
              Productivity Trend (Last 7 Days)
            </h3>
            
            <div className="space-y-4">
              {productivity.map((day, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className={`text-sm font-medium w-16 ${day.isToday ? 'text-primary' : 'text-surface-600 dark:text-surface-400'}`}>
                    {day.date}
                  </div>
                  <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${day.isToday ? 'bg-primary' : 'bg-green-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.completed / maxCompleted) * 100}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                  <div className={`text-sm font-medium w-8 ${day.isToday ? 'text-primary' : 'text-surface-600 dark:text-surface-400'}`}>
                    {day.completed}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-surface-50 dark:bg-surface-800 rounded-xl">
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <ApperIcon name="Info" className="h-4 w-4" />
                <span className="text-sm">
                  You've completed {stats.completed} tasks total with a {stats.completionRate}% completion rate!
                </span>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="card-neu p-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-surface-800 dark:text-surface-200 mb-6">
              Recent Activity
            </h3>
            
            <div className="space-y-4">
              <AnimatePresence>
                {recentActivity.length === 0 ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ApperIcon name="Activity" className="h-12 w-12 text-surface-300 mx-auto mb-3" />
                    <p className="text-surface-500 dark:text-surface-400">
                      No recent activity yet
                    </p>
                  </motion.div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <ApperIcon 
                          name={activity.type === 'completed' ? 'CheckCircle' : 'Plus'} 
                          className="h-4 w-4" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
                          {activity.task}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          {activity.type === 'completed' ? 'Completed' : 'Created'} • 
                          {format(new Date(activity.time), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                        activity.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                        activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.priority}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Priority Breakdown */}
        <motion.div 
          className="mt-8 card-neu p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-surface-800 dark:text-surface-200 mb-6">
            Task Priority Breakdown
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Urgent', value: stats.priorityBreakdown.urgent, color: 'red-600', bg: 'red-100' },
              { label: 'High', value: stats.priorityBreakdown.high, color: 'orange-600', bg: 'orange-100' },
              { label: 'Medium', value: stats.priorityBreakdown.medium, color: 'yellow-600', bg: 'yellow-100' },
              { label: 'Low', value: stats.priorityBreakdown.low, color: 'green-600', bg: 'green-100' }
            ].map((priority, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl bg-${priority.bg} dark:bg-${priority.color}/20 text-center`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={`text-2xl font-bold text-${priority.color} mb-1`}>
                  {priority.value}
                </div>
                <div className={`text-sm font-medium text-${priority.color}`}>
                  {priority.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mt-8 card-neu p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-surface-800 dark:text-surface-200 mb-6">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Add New Task',
                description: 'Create a new task quickly',
                icon: 'Plus',
                action: 'add-task',
                color: 'primary'
              },
              {
                title: 'View Overdue',
                description: `${stats.overdue} tasks need attention`,
                icon: 'AlertTriangle',
                action: 'view-overdue',
                color: 'red-600'
              },
              {
                title: 'Today\'s Tasks',
                description: `${stats.dueToday} tasks due today`,
                icon: 'Calendar',
                action: 'view-today',
                color: 'yellow-600'
              }
            ].map((action, index) => (
              <motion.button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="p-4 rounded-xl border-2 border-surface-200 dark:border-surface-700 hover:border-primary/30 transition-all duration-300 text-left group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl bg-${action.color}/10 group-hover:bg-${action.color}/20 transition-all duration-300`}>
                    <ApperIcon name={action.icon} className={`h-5 w-5 text-${action.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-surface-800 dark:text-surface-200 mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard