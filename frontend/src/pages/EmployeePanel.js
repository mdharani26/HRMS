import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiBell, FiCalendar, FiEye, FiPlus, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';
import './EmployeePanel.css';

function EmployeePanel({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks/list', user);
      setTasks(res.data);
      // Simulate notifications for demo
      if (res.data.length > 0) {
        setNotifications([
          { id: 1, message: 'New task assigned: ' + res.data[0].title, read: false, date: new Date() },
          { id: 2, message: 'Task deadline approaching: Project Report', read: false, date: new Date(Date.now() - 86400000) }
        ]);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUpcomingLeaves = async () => {
    try {
      // Simulate upcoming leaves for demo
      setUpcomingLeaves([
        { id: 1, type: 'Annual', startDate: '2023-06-15', endDate: '2023-06-18', status: 'Approved' },
        { id: 2, type: 'Sick', startDate: '2023-07-01', endDate: '2023-07-02', status: 'Pending' }
      ]);
    } catch (error) {
      console.error("Error loading leaves:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}/status`, { status });
      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  useEffect(() => { 
    loadTasks();
    loadUpcomingLeaves();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadTasks();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const statCardVariants = {
    hover: {
      y: -5,
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className="employee-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="panel-header">
        <div className="header-content">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1>Employee Portal</h1>
            <p>Welcome back, {user.name}</p>
          </motion.div>
          
          <div className="header-actions">
            <div className="notification-wrapper">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`notification-btn ${notifications.some(n => !n.read) ? 'has-unread' : ''}`}
              >
                <FiBell />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="unread-badge">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    className="notification-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h4>Notifications</h4>
                    {notifications.length === 0 ? (
                      <p className="empty-notifications">No new notifications</p>
                    ) : (
                      <ul>
                        {notifications.map(notification => (
                          <li 
                            key={notification.id} 
                            className={notification.read ? '' : 'unread'}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <p>{notification.message}</p>
                            <small>
                              {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button 
              onClick={handleLogout} 
              className="logout-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut /> Logout
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="panel-main">
        {/* Quick Stats */}
        <motion.div 
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="stat-card total-tasks"
            variants={statCardVariants}
            whileHover="hover"
          >
            <div className="stat-icon">
              <FiCheck />
            </div>
            <h3>Total Tasks</h3>
            <p>{taskStats.total}</p>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${taskStats.total ? 100 : 0}%` }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-card pending-tasks"
            variants={statCardVariants}
            whileHover="hover"
          >
            <div className="stat-icon">
              <FiAlertCircle />
            </div>
            <h3>Pending</h3>
            <p>{taskStats.pending}</p>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${taskStats.total ? (taskStats.pending / taskStats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-card inprogress-tasks"
            variants={statCardVariants}
            whileHover="hover"
          >
            <div className="stat-icon">
              <FiClock />
            </div>
            <h3>In Progress</h3>
            <p>{taskStats.inProgress}</p>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${taskStats.total ? (taskStats.inProgress / taskStats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </motion.div>
          
          <motion.div 
            className="stat-card completed-tasks"
            variants={statCardVariants}
            whileHover="hover"
          >
            <div className="stat-icon">
              <FiCheck />
            </div>
            <h3>Completed</h3>
            <p>{taskStats.completed}</p>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ width: `${taskStats.total ? (taskStats.completed / taskStats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Upcoming Leaves (Mini Calendar) */}
        <motion.div 
          className="upcoming-leaves"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Upcoming Leaves</h3>
          {upcomingLeaves.length === 0 ? (
            <p className="no-leaves">No upcoming leaves scheduled</p>
          ) : (
            <ul>
              {upcomingLeaves.slice(0, 3).map(leave => (
                <li key={leave.id} className={`leave-status ${leave.status.toLowerCase()}`}>
                  <span className="leave-type">{leave.type} Leave</span>
                  <span className="leave-dates">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </span>
                  <span className="leave-status-badge">{leave.status}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Navigation Tabs */}
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            My Tasks
          </button>
          <button
            className={`tab-button ${activeTab === 'leave' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave')}
          >
            Leave Management
          </button>
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' ? (
            <motion.div
              key="tasks"
              className="tasks-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Task List Header */}
              <div className="tasks-header">
                <h2>My Tasks</h2>
                <div>
                  Showing {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </div>
              </div>

              {/* Task List */}
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <motion.div 
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <img src="/images/no-tasks.svg" alt="No tasks" />
                  <p>No tasks assigned yet</p>
                  <small>You're all caught up!</small>
                </motion.div>
              ) : (
                <motion.ul 
                  className="task-list"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {tasks.map((task, index) => (
                    <motion.li 
                      key={task._id} 
                      className="task-item"
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="task-content">
                        <div>
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          {task.dueDate && (
                            <div className="task-due-date">
                              <FiCalendar size={14} />
                              <span>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              {new Date(task.dueDate) < new Date() && task.status !== 'Completed' && (
                                <span className="overdue-badge">Overdue</span>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                            {task.status}
                          </span>
                        </div>
                        
                      </div>
                      <div className="task-footer">

                        <span className="task-date">
                          Assigned on: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        <span className="task-date">
                          Priority: {task.priority}
                        </span>
                        <select
                          value={task.status}
                          onChange={e => updateStatus(task._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="leave"
              className="leave-management"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Leave Management</h2>
              
              <div className="leave-options">
                <motion.div 
                  onClick={() => navigate(`/leave/apply?userId=${user._id}&userName=${user.name}`)}
                  className="leave-card apply-leave"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="leave-icon">
                    <FiPlus size={24} />
                  </div>
                  <h3>Apply for Leave</h3>
                  <p>Submit a new leave request for approval</p>
                  <div className="card-wave"></div>
                </motion.div>
                
                <motion.div 
                  onClick={() => navigate(`/leave/status?userId=${user._id}`)}
                  className="leave-card view-leave"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="leave-icon">
                    <FiEye size={24} />
                  </div>
                  <h3>View Leave Status</h3>
                  <p>Check the status of your submitted leave requests</p>
                  <div className="card-wave"></div>
                </motion.div>
              </div>

              {/* Leave History (simplified) */}
              <div className="leave-history">
                <h3>Recent Leave Requests</h3>
                {upcomingLeaves.length === 0 ? (
                  <p className="no-history">No leave history found</p>
                ) : (
                  <div className="history-table">
                    <div className="table-header">
                      <span>Type</span>
                      <span>Dates</span>
                      <span>Status</span>
                    </div>
                    {upcomingLeaves.map(leave => (
                      <div key={leave.id} className="table-row">
                        <span>{leave.type}</span>
                        <span>
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                        <span className={`status ${leave.status.toLowerCase()}`}>
                          {leave.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="panel-footer">
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          © {new Date().getFullYear()} Employee Portal. All rights reserved.
        </motion.p>
      </footer>
    </motion.div>
  );
}

export default EmployeePanel;