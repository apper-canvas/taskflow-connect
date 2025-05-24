import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isPast, startOfDay } from 'date-fns'
import ApperIcon from './ApperIcon'

function MainFeature() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [sortBy, setSortBy] = useState('dueDate')
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    category: 'personal',
    tags: []
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600', bg: 'bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' }
  ]

  const categories = [
    { value: 'personal', label: 'Personal', icon: 'User', color: 'text-blue-600' },
    { value: 'work', label: 'Work', icon: 'Briefcase', color: 'text-purple-600' },
    { value: 'health', label: 'Health', icon: 'Heart', color: 'text-red-600' },
    { value: 'learning', label: 'Learning', icon: 'BookOpen', color: 'text-green-600' },
    { value: 'finance', label: 'Finance', icon: 'DollarSign', color: 'text-yellow-600' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const task = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      ...newTask,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: newTask.tags.filter(tag => tag.trim())
    }

    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t))
      toast.success('Task updated successfully!')
      setEditingTask(null)
    } else {
      setTasks(prev => [...prev, task])
      toast.success('Task created successfully!')
    }

    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      category: 'personal',
      tags: []
    })
    setShowForm(false)
  }

  const handleEdit = (task) => {
    setNewTask(task)
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            updatedAt: new Date().toISOString()
          }
        : task
    ))
  }

  const addTag = (tag) => {
    if (tag.trim() && !newTask.tags.includes(tag.trim())) {
      setNewTask(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTag = (tagToRemove) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(task => {
        switch (filter) {
          case 'pending':
            return task.status === 'pending'
          case 'completed':
            return task.status === 'completed'
          case 'overdue':
            return task.status === 'pending' && task.dueDate && isPast(new Date(task.dueDate))
          case 'today':
            return task.dueDate && isToday(new Date(task.dueDate))
          case 'tomorrow':
            return task.dueDate && isTomorrow(new Date(task.dueDate))
          default:
            return true
        }
      })
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const overdue = tasks.filter(t => 
      t.status === 'pending' && t.dueDate && isPast(new Date(t.dueDate))
    ).length
    
    return { total, completed, pending, overdue }
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`
    
    return format(date, 'MMM d, yyyy')
  }

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1]
  }

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  const stats = getTaskStats()
  const filteredTasks = getFilteredTasks()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Dashboard */}
      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {[
          { label: 'Total Tasks', value: stats.total, icon: 'CheckSquare', color: 'primary' },
          { label: 'Completed', value: stats.completed, icon: 'CheckCircle', color: 'green-600' },
          { label: 'Pending', value: stats.pending, icon: 'Clock', color: 'yellow-600' },
          { label: 'Overdue', value: stats.overdue, icon: 'AlertTriangle', color: 'red-600' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="card-neu p-4 sm:p-6 text-center group hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-center mb-3">
              <div className={`p-3 rounded-xl bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-all duration-300`}>
                <ApperIcon name={stat.icon} className={`h-6 w-6 text-${stat.color}`} />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-bold text-${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400 font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Task Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Task Form Panel */}
        <motion.div 
          className="xl:col-span-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-neu p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-surface-800 dark:text-surface-200">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <motion.button
                onClick={() => {
                  setShowForm(!showForm)
                  if (showForm) {
                    setEditingTask(null)
                    setNewTask({
                      title: '',
                      description: '',
                      priority: 'medium',
                      status: 'pending',
                      dueDate: '',
                      category: 'personal',
                      tags: []
                    })
                  }
                }}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon 
                  name={showForm ? "X" : "Plus"} 
                  className="h-5 w-5" 
                />
              </motion.button>
            </div>

            <AnimatePresence>
              {(showForm || editingTask) && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      className="input-neu w-full"
                      placeholder="Enter task title..."
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      className="input-neu w-full h-20 resize-none"
                      placeholder="Add task description..."
                    />
                  </div>

                  {/* Priority and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Priority
                      </label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                        className="input-neu w-full"
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Category
                      </label>
                      <select
                        value={newTask.category}
                        onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                        className="input-neu w-full"
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="input-neu w-full"
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {newTask.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="X" className="h-3 w-3" />
                          </button>
                        </motion.span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tag and press Enter..."
                      className="input-neu w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag(e.target.value)
                          e.target.value = ''
                        }
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="btn-primary w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ApperIcon name={editingTask ? "Save" : "Plus"} className="h-5 w-5 mr-2" />
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </motion.button>

                  {editingTask && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setEditingTask(null)
                        setShowForm(false)
                        setNewTask({
                          title: '',
                          description: '',
                          priority: 'medium',
                          status: 'pending',
                          dueDate: '',
                          category: 'personal',
                          tags: []
                        })
                      }}
                      className="w-full px-6 py-3 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel Edit
                    </motion.button>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Task List Panel */}
        <motion.div 
          className="xl:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card-neu p-6">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="input-neu w-full pl-10"
                />
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-neu lg:w-40"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="today">Due Today</option>
                <option value="tomorrow">Due Tomorrow</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-neu lg:w-40"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="created">Created</option>
                <option value="title">Title</option>
              </select>
            </div>

            {/* Task List */}
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="mb-4">
                      <ApperIcon name="CheckSquare" className="h-16 w-16 text-surface-300 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-600 dark:text-surface-400 mb-2">
                      {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filter'}
                    </h3>
                    <p className="text-surface-500 dark:text-surface-500">
                      {tasks.length === 0 
                        ? 'Create your first task to get started!' 
                        : 'Try adjusting your search or filter criteria'
                      }
                    </p>
                  </motion.div>
                ) : (
                  filteredTasks.map((task) => {
                    const priorityInfo = getPriorityInfo(task.priority)
                    const categoryInfo = getCategoryInfo(task.category)
                    const dueDateDisplay = formatDueDate(task.dueDate)
                    const isOverdue = task.status === 'pending' && task.dueDate && isPast(new Date(task.dueDate))

                    return (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 group ${
                          task.status === 'completed'
                            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                            : isOverdue
                            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                            : 'bg-white border-surface-200 dark:bg-surface-800 dark:border-surface-600 hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <motion.button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                              task.status === 'completed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-surface-300 hover:border-primary'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {task.status === 'completed' && (
                              <ApperIcon name="Check" className="h-3 w-3 text-white" />
                            )}
                          </motion.button>

                          {/* Task Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h4 className={`font-semibold ${
                                task.status === 'completed'
                                  ? 'line-through text-surface-500'
                                  : 'text-surface-800 dark:text-surface-200'
                              }`}>
                                {task.title}
                              </h4>
                              
                              <div className="flex items-center gap-2">
                                {/* Priority Badge */}
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.bg} ${priorityInfo.color}`}>
                                  {priorityInfo.label}
                                </span>
                                
                                {/* Category Badge */}
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-700 ${categoryInfo.color}`}>
                                  <ApperIcon name={categoryInfo.icon} className="h-3 w-3" />
                                  {categoryInfo.label}
                                </span>
                              </div>
                            </div>

                            {task.description && (
                              <p className={`text-sm mb-2 ${
                                task.status === 'completed'
                                  ? 'text-surface-400'
                                  : 'text-surface-600 dark:text-surface-400'
                              }`}>
                                {task.description}
                              </p>
                            )}

                            {/* Tags */}
                            {task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {task.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              {/* Due Date */}
                              {dueDateDisplay && (
                                <div className={`flex items-center gap-1 text-xs ${
                                  isOverdue ? 'text-red-600' : 'text-surface-500'
                                }`}>
                                  <ApperIcon name="Calendar" className="h-3 w-3" />
                                  {dueDateDisplay}
                                </div>
                              )}

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  onClick={() => handleEdit(task)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ApperIcon name="Edit2" className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDelete(task.id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ApperIcon name="Trash2" className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Quick Stats */}
            {filteredTasks.length > 0 && (
              <motion.div 
                className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-surface-600 dark:text-surface-400">
                  <span>
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </span>
                  {filter !== 'all' && (
                    <motion.button
                      onClick={() => setFilter('all')}
                      className="text-primary hover:text-primary-dark font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      Clear Filter
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainFeature