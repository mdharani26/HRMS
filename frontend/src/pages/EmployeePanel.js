import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EmployeePanel.css'; // We'll create this CSS file

function EmployeePanel({ user, setUser }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/tasks/list', user);
      setTasks(res.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
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
  localStorage.removeItem('user'); // Optional: only if you're using localStorage
  navigate('/login'); // Or '/' depending on your route
};

  useEffect(() => { 
    loadTasks(); 
  }, []);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length
  };

  return (
    <div className="employee-panel">
      {/* Header */}
      <header className="panel-header">
        <div className="header-content">
          <div>
            <h1>Employee Portal</h1>
            <p>Welcome back, {user.name}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="panel-main">
        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card total-tasks">
            <h3>Total Tasks</h3>
            <p>{taskStats.total}</p>
          </div>
          
          <div className="stat-card pending-tasks">
            <h3>Pending</h3>
            <p>{taskStats.pending}</p>
          </div>
          
          <div className="stat-card inprogress-tasks">
            <h3>In Progress</h3>
            <p>{taskStats.inProgress}</p>
          </div>
          
          <div className="stat-card completed-tasks">
            <h3>Completed</h3>
            <p>{taskStats.completed}</p>
          </div>
        </div>

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
        {activeTab === 'tasks' ? (
          <div className="tasks-container">
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
              <div className="empty-state">
                <p>No tasks assigned yet</p>
              </div>
            ) : (
              <ul className="task-list">
                {tasks.map(task => (
                  <li key={task._id} className="task-item">
                    <div className="task-content">
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
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
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="leave-management">
            <h2>Leave Management</h2>
            
            <div className="leave-options">
              <div 
                onClick={() => navigate(`/leave/apply?userId=${user._id}&userName=${user.name}`)}
                className="leave-card apply-leave"
              >
                <div className="leave-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                  </svg>
                </div>
                <h3>Apply for Leave</h3>
                <p>Submit a new leave request for approval</p>
              </div>
              
              <div 
                onClick={() => navigate(`/leave/status?userId=${user._id}`)}
                className="leave-card view-leave"
              >
                <div className="leave-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                </div>
                <h3>View Leave Status</h3>
                <p>Check the status of your submitted leave requests</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="panel-footer">
        © {new Date().getFullYear()} Employee Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default EmployeePanel;