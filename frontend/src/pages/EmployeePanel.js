import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion';
import { 
  FiLogOut, FiBell, FiCalendar, FiEye, FiPlus, FiCheck, 
  FiClock, FiAlertCircle, FiChevronDown, FiChevronUp, 
  FiSearch, FiFilter, FiTrendingUp, FiAward, FiBarChart2 
} from 'react-icons/fi';
import { FaTasks, FaRegCalendarAlt, FaRegChartBar } from 'react-icons/fa';
import { RiTeamLine } from 'react-icons/ri';
import { BsGraphUp, BsLightningCharge } from 'react-icons/bs';
import './EmployeePanel.css';

function EmployeePanel({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [upcomingLeaves, setUpcomingLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeStat, setActiveStat] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(null);
  const navigate = useNavigate();
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Stats with icons and colors
  const statsData = [
    { id: 'total', label: 'Total Tasks', icon: <FaTasks />, color: '#6366f1' },
    { id: 'pending', label: 'Pending', icon: <FiAlertCircle />, color: '#f59e0b' },
    { id: 'inProgress', label: 'In Progress', icon: <FiClock />, color: '#3b82f6' },
    { id: 'completed', label: 'Completed', icon: <FiCheck />, color: '#10b981' },
    { id: 'highPriority', label: 'High Priority', icon: <BsLightningCharge />, color: '#ef4444' },
    { id: 'overdue', label: 'Overdue', icon: <FiAlertCircle />, color: '#dc2626' }
  ];

  const loadTasks = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks/list', user);
      const tasksWithPriority = res.data.map(task => ({
        ...task,
        priority: task.priority || 'Medium' // Default to Medium if not specified
      }));
      setTasks(tasksWithPriority);
      setFilteredTasks(tasksWithPriority);
      
      // Simulate notifications for demo
      if (res.data.length > 0) {
        setNotifications([
          { 
            id: 1, 
            message: 'New task assigned: ' + res.data[0].title, 
            read: false, 
            date: new Date(),
            type: 'task'
          },
          { 
            id: 2, 
            message: 'Task deadline approaching: Project Report', 
            read: false, 
            date: new Date(Date.now() - 86400000),
            type: 'reminder'
          },
          { 
            id: 3, 
            message: 'Your leave request has been approved', 
            read: false, 
            date: new Date(Date.now() - 3600000),
            type: 'leave'
          }
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
        { id: 1, type: 'Annual', startDate: '2023-06-15', endDate: '2023-06-18', status: 'Approved', days: 4 },
        { id: 2, type: 'Sick', startDate: '2023-07-01', endDate: '2023-07-02', status: 'Pending', days: 2 },
        { id: 3, type: 'Personal', startDate: '2023-08-10', endDate: '2023-08-12', status: 'Rejected', days: 3 }
      ]);
    } catch (error) {
      console.error("Error loading leaves:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}/status`, { status });
      loadTasks();
      
      // Add animation when task is completed
      if (status === 'Completed') {
        controls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.5 }
        });
      }
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

  const filterTasks = () => {
    let result = tasks;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'All') {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    setFilteredTasks(result);
  };

  useEffect(() => {
    filterTasks();
  }, [searchTerm, statusFilter, priorityFilter, tasks]);

  useEffect(() => { 
    loadTasks();
    loadUpcomingLeaves();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadTasks();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    highPriority: tasks.filter(t => t.priority === 'High').length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length
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
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      y: -10,
      scale: 1.05,
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }
    },
    tap: { scale: 0.95 }
  };

  const taskItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5
      }
    }),
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  const notificationVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, height: 0 }
  };

  const leaveCardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="employee-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="panel-header">
        <div className="header-content">
          <motion.div 
            className="user-greeting"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="avatar"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <h1>Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="welcome-message">
                {new Date().getHours() < 12 ? 'Good morning' : 
                 new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}
                {tasks.length > 0 ? ` • You have ${taskStats.pending} pending tasks` : ''}
              </p>
            </div>
          </motion.div>
          
          <div className="header-actions">
            <div className="notification-wrapper">
              <motion.button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`notification-btn ${notifications.some(n => !n.read) ? 'has-unread' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiBell />
                {notifications.filter(n => !n.read).length > 0 && (
                  <motion.span 
                    className="unread-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {notifications.filter(n => !n.read).length}
                  </motion.span>
                )}
              </motion.button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    className="notification-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="notification-header">
                      <h4>Notifications</h4>
                      <button 
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="mark-all-read"
                      >
                        Mark all as read
                      </button>
                    </div>
                    {notifications.length === 0 ? (
                      <motion.p 
                        className="empty-notifications"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        No new notifications
                      </motion.p>
                    ) : (
                      <ul>
                        <AnimatePresence>
                          {notifications.map(notification => (
                            <motion.li 
                              key={notification.id} 
                              className={`notification-item ${notification.read ? '' : 'unread'} ${notification.type}`}
                              onClick={() => markNotificationAsRead(notification.id)}
                              variants={notificationVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              layout
                            >
                              <div className="notification-icon">
                                {notification.type === 'task' ? <FaTasks /> : 
                                 notification.type === 'leave' ? <FaRegCalendarAlt /> : 
                                 <FiAlertCircle />}
                              </div>
                              <div className="notification-content">
                                <p>{notification.message}</p>
                                <small>
                                  {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {' • '}
                                  {new Date(notification.date).toLocaleDateString()}
                                </small>
                              </div>
                              {!notification.read && <div className="unread-dot"></div>}
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button 
              onClick={handleLogout} 
              className="logout-btn"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: '#ef4444'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut /> Logout
            </motion.button>
          </div>
        </div>

        {/* Animated background elements */}
        <motion.div 
          className="header-bg-circle-1"
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
            transition: { duration: 15, repeat: Infinity, ease: "linear" }
          }}
        />
        <motion.div 
          className="header-bg-circle-2"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            transition: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        />
      </header>

      {/* Main Content */}
      <main className="panel-main" ref={ref}>
        {/* Quick Stats */}
        <motion.div 
          className="stats-grid"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {statsData.map((stat, i) => (
            <motion.div 
              key={stat.id}
              className={`stat-card ${stat.id}`}
              custom={i}
              variants={statCardVariants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setActiveStat(stat.id)}
              onHoverEnd={() => setActiveStat(null)}
              style={{
                transform: activeStat === stat.id ? 'translateY(-10px)' : 'none',
                boxShadow: activeStat === stat.id ? `0 10px 20px ${stat.color}30` : 'none'
              }}
            >
              <div className="stat-icon" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.label}</h3>
                <motion.p 
                  className="stat-value"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  key={taskStats[stat.id]}
                >
                  {taskStats[stat.id]}
                </motion.p>
              </div>
              <div className="stat-progress">
                <motion.div 
                  className="progress-bar" 
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${taskStats.total ? (taskStats[stat.id] / (stat.id === 'total' ? 1 : taskStats.total)) * 100 : 0}%`,
                    backgroundColor: stat.color
                  }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
              {activeStat === stat.id && (
                <motion.div 
                  className="stat-tooltip"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {taskStats[stat.id]} {stat.label.toLowerCase()}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Dashboard Widgets */}
        <div className="dashboard-widgets">
          {/* Upcoming Leaves Widget */}
          <motion.div 
            className="widget upcoming-leaves"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="widget-header">
              <h3>
                <FaRegCalendarAlt /> Upcoming Leaves
              </h3>
              <button 
                className="view-all"
                onClick={() => navigate(`/leave/status?userId=${user._id}`)}
              >
                View All
              </button>
            </div>
            {upcomingLeaves.length === 0 ? (
              <motion.div 
                className="empty-widget"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <img src="/images/no-leaves.svg" alt="No leaves" />
                <p>No upcoming leaves scheduled</p>
              </motion.div>
            ) : (
              <ul>
                {upcomingLeaves.slice(0, 3).map(leave => (
                  <motion.li 
                    key={leave.id} 
                    className={`leave-status ${leave.status.toLowerCase()}`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="leave-type">
                      <span className="leave-icon">
                        {leave.type === 'Annual' ? <FiAward /> : 
                         leave.type === 'Sick' ? <FiAlertCircle /> : 
                         <FaRegCalendarAlt />}
                      </span>
                      {leave.type} Leave
                    </div>
                    <div className="leave-dates">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                      <span className="leave-days">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                    </div>
                    <div className="leave-status-badge">
                      {leave.status}
                      {leave.status === 'Approved' && (
                        <motion.span 
                          className="pulse-dot"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Productivity Widget */}
          <motion.div 
            className="widget productivity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="widget-header">
              <h3>
                <BsGraphUp /> Your Productivity
              </h3>
              <span className="trend">
                <FiTrendingUp /> +12%
              </span>
            </div>
            <div className="productivity-content">
              <div className="productivity-metric">
                <div className="metric-value">84%</div>
                <div className="metric-label">Completion Rate</div>
              </div>
              <div className="productivity-chart">
                {/* This would be replaced with an actual chart component */}
                <div className="chart-bar" style={{ height: '70%' }}></div>
                <div className="chart-bar" style={{ height: '90%' }}></div>
                <div className="chart-bar" style={{ height: '60%' }}></div>
                <div className="chart-bar" style={{ height: '80%' }}></div>
                <div className="chart-bar" style={{ height: '95%' }}></div>
              </div>
            </div>
            <div className="productivity-footer">
              <span className="improvement">
                You're doing better than 78% of your peers
              </span>
            </div>
          </motion.div>

          {/* Team Activity Widget */}
          <motion.div 
            className="widget team-activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="widget-header">
              <h3>
                <RiTeamLine /> Team Activity
              </h3>
            </div>
            <div className="team-members">
              {['John', 'Sarah', 'Mike', 'Lisa', 'David'].map((member, i) => (
                <motion.div 
                  key={i}
                  className="team-member"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="member-avatar">
                    {member.charAt(0)}
                    <motion.div 
                      className="status-dot"
                      animate={{ 
                        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'][i % 3]
                      }}
                    />
                  </div>
                  <div className="member-info">
                    <div className="member-name">{member}</div>
                    <div className="member-status">
                      {['Completed a task', 'On leave', 'Working on project'][i % 3]}
                    </div>
                  </div>
                  <div className="member-time">
                    {i + 1}h ago
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <motion.div 
          className="tab-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <FaTasks /> My Tasks
          </button>
          <button
            className={`tab-button ${activeTab === 'leave' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave')}
          >
            <FaRegCalendarAlt /> Leave Management
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FaRegChartBar /> Reports
          </button>
        </motion.div>

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
                <div className="task-controls">
                  <div className="search-box">
                    <FiSearch className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    className="filter-btn"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FiFilter /> Filters {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                </div>
              </div>

              {/* Task Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    className="task-filters"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="filter-group">
                      <label>Status:</label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Priority:</label>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                      >
                        <option value="All">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <button 
                      className="reset-filters"
                      onClick={() => {
                        setStatusFilter('All');
                        setPriorityFilter('All');
                        setSearchTerm('');
                      }}
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Task Stats Bar */}
              <motion.div 
                className="task-stats-bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="stat-item">
                  <span className="stat-label">Showing</span>
                  <span className="stat-value">{filteredTasks.length}</span>
                  <span className="stat-label">tasks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">
                    {filteredTasks.filter(t => t.status === 'Completed').length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value">
                    {filteredTasks.filter(t => t.status === 'In Progress').length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Overdue</span>
                  <span className="stat-value overdue">
                    {filteredTasks.filter(t => 
                      new Date(t.dueDate) < new Date() && t.status !== 'Completed'
                    ).length}
                  </span>
                </div>
              </motion.div>

              {/* Task List */}
              {loading ? (
                <div className="loading-state">
                  <motion.div 
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p>Loading your tasks...</p>
                </div>
              ) : filteredTasks.length === 0 ? (
                <motion.div 
                  className="empty-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img src="/images/no-tasks.svg" alt="No tasks" />
                  <h3>No tasks found</h3>
                  <p>Try adjusting your filters or check back later</p>
                  <button 
                    className="refresh-btn"
                    onClick={loadTasks}
                  >
                    Refresh Tasks
                  </button>
                </motion.div>
              ) : (
                <motion.ul 
                  className="task-list"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {filteredTasks.map((task, index) => (
                      <motion.li 
                        key={task._id} 
                        className={`task-item ${task.priority.toLowerCase()}`}
                        custom={index}
                        variants={taskItemVariants}
                        whileHover="hover"
                        layout
                      >
                        <div className="task-main" onClick={() => setShowTaskDetails(showTaskDetails === task._id ? null : task._id)}>
                          <div className="task-checkbox">
                            <input 
                              type="checkbox" 
                              checked={task.status === 'Completed'}
                              onChange={(e) => updateStatus(
                                task._id, 
                                e.target.checked ? 'Completed' : 'Pending'
                              )}
                            />
                          </div>
                          <div className="task-content">
                            <div className="task-header">
                              <h3>{task.title}</h3>
                              <div className="task-priority">
                                {task.priority}
                              </div>
                            </div>
                            <p className="task-description">
                              {task.description.length > 100 && showTaskDetails !== task._id 
                                ? `${task.description.substring(0, 100)}...` 
                                : task.description}
                            </p>
                            <div className="task-meta">
                              {task.dueDate && (
                                <div className={`task-due-date ${
                                  new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'overdue' : ''
                                }`}>
                                  <FiCalendar size={14} />
                                  <span>
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              <div className="task-assigned">
                                Assigned on: {new Date(task.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="task-status">
                            <select
                              value={task.status}
                              onChange={e => updateStatus(task._id, e.target.value)}
                              className={`status-select ${task.status.toLowerCase().replace(' ', '-')}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>

                        {/* Task Details (expanded view) */}
                        <AnimatePresence>
                          {showTaskDetails === task._id && (
                            <motion.div 
                              className="task-details"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="detail-row">
                                <span className="detail-label">Project:</span>
                                <span className="detail-value">{task.project || 'N/A'}</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Assigned By:</span>
                                <span className="detail-value">{task.assignedBy || 'Manager'}</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Estimated Time:</span>
                                <span className="detail-value">{task.estimatedHours || 'N/A'} hours</span>
                              </div>
                              <div className="detail-row">
                                <span className="detail-label">Attachments:</span>
                                <span className="detail-value">
                                  {task.attachments ? task.attachments.length : 0} files
                                </span>
                              </div>
                              <div className="task-actions">
                                <button className="action-btn view-btn">
                                  <FiEye /> View Details
                                </button>
                                <button className="action-btn comment-btn">
                                  Add Comment
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </motion.div>
          ) : activeTab === 'leave' ? (
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
                  variants={leaveCardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="leave-icon">
                    <FiPlus size={24} />
                  </div>
                  <h3>Apply for Leave</h3>
                  <p>Submit a new leave request for approval</p>
                  <div className="card-wave"></div>
                  <motion.div 
                    className="hover-effect"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  />
                </motion.div>
                
                <motion.div 
                  onClick={() => navigate(`/leave/status?userId=${user._id}`)}
                  className="leave-card view-leave"
                  variants={leaveCardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="leave-icon">
                    <FiEye size={24} />
                  </div>
                  <h3>View Leave Status</h3>
                  <p>Check the status of your submitted leave requests</p>
                  <div className="card-wave"></div>
                  <motion.div 
                    className="hover-effect"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                  />
                </motion.div>

                <motion.div 
                  className="leave-card leave-balance"
                  variants={leaveCardVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="leave-icon">
                    <FiBarChart2 size={24} />
                  </div>
                  <h3>Leave Balance</h3>
                  <div className="balance-details">
                    <div className="balance-item">
                      <span className="balance-type">Annual</span>
                      <span className="balance-days">12 days left</span>
                    </div>
                    <div className="balance-item">
                      <span className="balance-type">Sick</span>
                      <span className="balance-days">5 days left</span>
                    </div>
                    <div className="balance-item">
                      <span className="balance-type">Personal</span>
                      <span className="balance-days">3 days left</span>
                    </div>
                  </div>
                  <div className="card-wave"></div>
                </motion.div>
              </div>

              {/* Leave History */}
              <div className="leave-history">
                <div className="history-header">
                  <h3>Recent Leave Requests</h3>
                  <button 
                    className="view-all"
                    onClick={() => navigate(`/leave/status?userId=${user._id}`)}
                  >
                    View All
                  </button>
                </div>
                {upcomingLeaves.length === 0 ? (
                  <motion.div 
                    className="empty-history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <img src="/images/no-history.svg" alt="No history" />
                    <p>No leave history found</p>
                  </motion.div>
                ) : (
                  <div className="history-table">
                    <div className="table-header">
                      <span>Type</span>
                      <span>Dates</span>
                      <span>Duration</span>
                      <span>Status</span>
                      <span>Actions</span>
                    </div>
                    <AnimatePresence>
                      {upcomingLeaves.map((leave, i) => (
                        <motion.div 
                          key={leave.id}
                          className="table-row"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ backgroundColor: 'rgba(245, 245, 245, 0.8)' }}
                        >
                          <span>
                            {leave.type === 'Annual' ? <FiAward /> : 
                             leave.type === 'Sick' ? <FiAlertCircle /> : 
                             <FaRegCalendarAlt />}
                            {leave.type}
                          </span>
                          <span>
                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                          <span>{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                          <span className={`status ${leave.status.toLowerCase()}`}>
                            {leave.status}
                            {leave.status === 'Pending' && (
                              <motion.span 
                                className="pulse-dot"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </span>
                          <span className="actions">
                            <button className="action-btn view-btn">
                              <FiEye />
                            </button>
                            {leave.status === 'Pending' && (
                              <button className="action-btn cancel-btn">
                                Cancel
                              </button>
                            )}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reports"
              className="reports-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Performance Reports</h2>
              <p className="reports-description">
                View your performance metrics, productivity trends, and task completion statistics.
              </p>
              
              <div className="report-cards">
                <motion.div 
                  className="report-card productivity-report"
                  whileHover={{ y: -5 }}
                >
                  <div className="report-header">
                    <BsGraphUp className="report-icon" />
                    <h3>Productivity Report</h3>
                  </div>
                  <div className="report-content">
                    {/* This would be replaced with an actual chart */}
                    <div className="productivity-chart">
                      <div className="chart-line"></div>
                      <div className="chart-point" style={{ left: '10%', bottom: '30%' }}></div>
                      <div className="chart-point" style={{ left: '30%', bottom: '50%' }}></div>
                      <div className="chart-point" style={{ left: '50%', bottom: '70%' }}></div>
                      <div className="chart-point" style={{ left: '70%', bottom: '60%' }}></div>
                      <div className="chart-point" style={{ left: '90%', bottom: '80%' }}></div>
                    </div>
                    <div className="report-stats">
                      <div className="stat-item">
                        <span className="stat-value">84%</span>
                        <span className="stat-label">Avg. Completion</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">+12%</span>
                        <span className="stat-label">Improvement</span>
                      </div>
                    </div>
                  </div>
                  <button className="view-report-btn">
                    View Full Report
                  </button>
                </motion.div>
                
                <motion.div 
                  className="report-card task-report"
                  whileHover={{ y: -5 }}
                >
                  <div className="report-header">
                    <FaTasks className="report-icon" />
                    <h3>Task Completion</h3>
                  </div>
                  <div className="report-content">
                    {/* This would be replaced with an actual chart */}
                    <div className="task-chart">
                      <div className="chart-bar" style={{ height: '70%' }}>
                        <div className="bar-label">Completed</div>
                      </div>
                      <div className="chart-bar" style={{ height: '20%' }}>
                        <div className="bar-label">In Progress</div>
                      </div>
                      <div className="chart-bar" style={{ height: '10%' }}>
                        <div className="bar-label">Pending</div>
                      </div>
                    </div>
                    <div className="report-stats">
                      <div className="stat-item">
                        <span className="stat-value">{taskStats.completed}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{taskStats.inProgress}</span>
                        <span className="stat-label">In Progress</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{taskStats.pending}</span>
                        <span className="stat-label">Pending</span>
                      </div>
                    </div>
                  </div>
                  <button className="view-report-btn">
                    View Full Report
                  </button>
                </motion.div>
              </div>
              
              <div className="report-details">
                <h3>Monthly Performance</h3>
                <div className="performance-table">
                  <div className="table-header">
                    <span>Month</span>
                    <span>Tasks Completed</span>
                    <span>On Time %</span>
                    <span>Productivity</span>
                    <span>Rating</span>
                  </div>
                  {[
                    { month: 'June 2023', completed: 24, onTime: 92, productivity: 88, rating: 4.5 },
                    { month: 'May 2023', completed: 22, onTime: 86, productivity: 82, rating: 4.2 },
                    { month: 'April 2023', completed: 18, onTime: 78, productivity: 75, rating: 3.9 },
                    { month: 'March 2023', completed: 20, onTime: 85, productivity: 80, rating: 4.1 }
                  ].map((row, i) => (
                    <motion.div 
                      key={i}
                      className="table-row"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span>{row.month}</span>
                      <span>{row.completed}</span>
                      <span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${row.onTime}%` }}
                          ></div>
                        </div>
                        {row.onTime}%
                      </span>
                      <span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${row.productivity}%` }}
                          ></div>
                        </div>
                        {row.productivity}%
                      </span>
                      <span className="rating">
                        {row.rating}
                        <div className="stars">
                          {[...Array(5)].map((_, j) => (
                            <span 
                              key={j}
                              className={`star ${j < Math.floor(row.rating) ? 'filled' : ''} ${
                                j === Math.floor(row.rating) && row.rating % 1 >= 0.5 ? 'half-filled' : ''
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="panel-footer">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            © {new Date().getFullYear()} Employee Portal v2.0
          </motion.p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>
        </motion.div>
        
        {/* Animated background elements */}
        <motion.div 
          className="footer-bg-circle"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            transition: { duration: 25, repeat: Infinity, ease: "linear" }
          }}
        />
      </footer>
    </motion.div>
  );
} 

export default EmployeePanel;