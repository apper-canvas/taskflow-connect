import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO,
  isToday
} from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCenter
} from '@dnd-kit/core'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [tasks, setTasks] = useState([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
  const [activeTask, setActiveTask] = useState(null)
    category: 'work',
    dueDate: '',
    tags: [],
    status: 'pending'
  })
  
  const [tagInput, setTagInput] = useState('')
  
  // Load tasks on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow_tasks')
    if (savedTasks) {

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (!over) {
      setActiveTask(null)
      return
    }
    
    const taskId = active.id
    const newDate = over.id
    
    // Find the task being dragged
    const task = tasks.find(t => t.id === taskId)
    if (!task) {
      setActiveTask(null)
      return
    }
    
    // Check if dropping on a different date
    const currentDate = task.dueDate
    if (currentDate === newDate) {
      setActiveTask(null)
      return
    }
    
    // Update task with new due date
    const updatedTasks = tasks.map(t => 
      t.id === taskId 
        ? { ...t, dueDate: newDate, updatedAt: new Date().toISOString() }
        : t
    )
    
    setTasks(updatedTasks)
    
    // Update selected tasks if modal is open and date matches
    if (selectedDate && showTaskModal) {
      const dayTasks = getTasksForDate(selectedDate)
      setSelectedTasks(dayTasks)
    }
    
    setActiveTask(null)
    toast.success(`Task moved to ${format(parseISO(newDate), 'MMM d, yyyy')}`)
  }
  
  // Handle drag start
  const handleDragStart = (event) => {
    const taskId = event.active.id
    const task = tasks.find(t => t.id === taskId)
    setActiveTask(task)
  }
      setTasks(JSON.parse(savedTasks))
    }
  }, [])
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks))
  }, [tasks])
  
  // Calendar navigation
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }
  
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }
  
  const goToToday = () => {
    setCurrentDate(new Date())
  }
  
  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      try {
        const taskDate = parseISO(task.dueDate)
        return isSameDay(taskDate, date)
      } catch {
        return false
      }
    })
  }
  
  // Handle day click
  const handleDayClick = (date) => {
    setSelectedDate(date)
    const dayTasks = getTasksForDate(date)
    setSelectedTasks(dayTasks)
    setShowTaskModal(true)
  }
  
  // Handle create new task
  const handleCreateTask = () => {
    setEditingTask(null)
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      category: 'work',
      dueDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      tags: [],
      status: 'pending'
    })
    setTagInput('')
    setShowCreateModal(true)
  }
  
  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || '',
      tags: task.tags || [],
      status: task.status
    })
    setTagInput('')
    setShowCreateModal(true)
  }
  
  // Handle delete task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId)
      setTasks(updatedTasks)
      
      // Update selected tasks if viewing day details
      if (selectedDate) {
        const dayTasks = getTasksForDate(selectedDate)
        setSelectedTasks(dayTasks.filter(task => task.id !== taskId))
      }
      
      toast.success('Task deleted successfully!')
    }
  }
  
  // Handle task form submission
  const handleTaskSubmit = (e) => {
    e.preventDefault()
    
    if (!taskForm.title.trim()) {
      toast.error('Task title is required!')
      return
    }
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskForm, updatedAt: new Date().toISOString() }
          : task
      )
      setTasks(updatedTasks)
      
      // Update selected tasks if viewing day details
      if (selectedDate) {
        const dayTasks = getTasksForDate(selectedDate)
        setSelectedTasks(dayTasks)
      }
      
      toast.success('Task updated successfully!')
    } else {
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        ...taskForm,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)

// Draggable Task Component
const DraggableTask = ({ task, children }) => {
  const {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-primary-900">
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  })

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-move"
    >
      {children}
    </div>
  )
}

// Droppable Day Component
const DroppableDay = ({ date, children, isCurrentMonth }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: format(date, 'yyyy-MM-dd'),
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        ${isOver && isCurrentMonth ? 'bg-primary-100 border-primary-300' : ''}
        ${isOver && !isCurrentMonth ? 'bg-surface-200' : ''}
      `}
    >
      {children}
    </div>
  )
}
      
      // Update selected tasks if viewing day details
      if (selectedDate) {
        const dayTasks = getTasksForDate(selectedDate)
        setSelectedTasks([...dayTasks, newTask])
      }
      
      toast.success('Task created successfully!')
    }
    
    setShowCreateModal(false)
                <DroppableDay date={day} isCurrentMonth={isCurrentMonth}>
                  <motion.div
                    key={day.toString()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative min-h-[120px] p-3 border-r border-b border-surface-200 last:border-r-0 cursor-pointer transition-all duration-300
                      ${isCurrentMonth ? 'bg-white hover:bg-surface-50' : 'bg-surface-100 text-surface-400'}
                      ${isDayToday ? 'bg-primary-50 border-primary-200' : ''}
                    `}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className={`
                      text-sm font-medium mb-2
                      ${isDayToday ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                    `}>
                      {format(day, 'd')}
                    </div>
                    
                    {/* Task indicators */}
                    {dayTasks.length > 0 && (
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map(task => (
                          <DraggableTask key={task.id} task={task}>
                            <div
                              className={`
                                text-xs p-1 rounded truncate text-white font-medium transition-all duration-200 hover:shadow-md
                                ${getPriorityColor(task.priority)}
                              `}
                              title={task.title}
                            >
                              {task.title}
                            </div>
                          </DraggableTask>
                        ))}
                        
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-surface-500 font-medium">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </DroppableDay>
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }
  
  const calendarDays = generateCalendarDays()
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-surface-100 to-primary-50 dark:from-surface-900 dark:via-surface-800 dark:to-primary-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-surface-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Calendar
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={goToToday}
                className="btn-sleek"
              >
                Today
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg bg-white shadow-soft hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <ApperIcon name="ChevronLeft" className="w-5 h-5 text-surface-600" />
                </button>
                
                <h2 className="text-lg font-semibold text-surface-800 min-w-[200px] text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg bg-white shadow-soft hover:shadow-md transition-all duration-300 hover:scale-105"
                >
                  <ApperIcon name="ChevronRight" className="w-5 h-5 text-surface-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Calendar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-neu-light border border-surface-200/50 overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-surface-50 border-b border-surface-200">
            {weekDays.map(day => (
              <div key={day} className="p-4 text-center font-semibold text-surface-600 border-r border-surface-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDate(day)
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isDayToday = isToday(day)
              
              return (
                <motion.div
                  key={day.toString()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative min-h-[120px] p-3 border-r border-b border-surface-200 last:border-r-0 cursor-pointer transition-all duration-300
                    ${isCurrentMonth ? 'bg-white hover:bg-surface-50' : 'bg-surface-100 text-surface-400'}
                    ${isDayToday ? 'bg-primary-50 border-primary-200' : ''}
                  `}
                  onClick={() => handleDayClick(day)}
                >
                  <div className={`
                    text-sm font-medium mb-2
                    ${isDayToday ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Task indicators */}
                  {dayTasks.length > 0 && (
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          className={`
                            text-xs p-1 rounded truncate text-white font-medium
                            ${getPriorityColor(task.priority)}
                          `}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-surface-500 font-medium">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Day Tasks Modal */}
      <AnimatePresence>
        {showTaskModal && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTaskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-surface-200 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-surface-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <p className="text-sm text-surface-600 mt-1">
                      {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCreateTask}
                      className="btn-sleek"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                      Add Task
                    </button>
                    
                    <button
                      onClick={() => setShowTaskModal(false)}
                      className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {selectedTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Calendar" className="w-8 h-8 text-surface-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-surface-900 mb-2">No tasks for this day</h4>
                    <p className="text-surface-600 mb-6">Create a new task to get started</p>
                    <button
                      onClick={handleCreateTask}
                      className="btn-primary"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                      Create Task
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedTasks.map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        className="bg-gradient-to-r from-white to-surface-50 rounded-xl p-4 border border-surface-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-surface-900">{task.title}</h4>
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium text-white
                                ${getPriorityColor(task.priority)}
                              `}>
                                {task.priority}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-200 text-surface-700">
                                {task.category}
                              </span>
                            </div>
                            
                            {task.description && (
                              <p className="text-sm text-surface-600 mb-3">{task.description}</p>
                            )}
                            
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {task.tags.map(tag => (
                                  <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-surface-500">
                              <span>Status: {task.status}</span>
                              {task.dueDate && (
                                <span>Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                              title="Edit task"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                              title="Delete task"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Create/Edit Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-surface-200 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-surface-900">
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
                  </button>
                </div>
              </div>
              
        
        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <div className={`
              text-xs p-1 rounded truncate text-white font-medium shadow-lg transform rotate-2
              ${getPriorityColor(activeTask.priority)}
            `}>
              {activeTask.title}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="input-neu w-full"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="input-neu w-full h-24 resize-none"
                    placeholder="Enter task description"
                  />
                </div>
                
                {/* Priority and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="input-neu w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Category
                    </label>
                    <select
                      value={taskForm.category}
                      onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                      className="input-neu w-full"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="shopping">Shopping</option>
                      <option value="health">Health</option>
                      <option value="education">Education</option>
                      <option value="finance">Finance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                {/* Due Date and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="input-neu w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">
                      Status
                    </label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      className="input-neu w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">
                    Tags
                  </label>
                  
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="input-neu flex-1"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn-sleek"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {taskForm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {taskForm.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-primary hover:text-primary-dark"
                          >
                            <ApperIcon name="X" className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Calendar