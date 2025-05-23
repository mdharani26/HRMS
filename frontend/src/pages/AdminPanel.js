import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './AdminPanel.css';

ChartJS.register(...registerables);

// SVG Icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);

const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
  </svg>
);

const LeaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
  </svg>
);

const PerformanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
);

function AdminPanel({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [performanceData, setPerformanceData] = useState({
    userCounts: { admin: 0, employee: 0 },
    taskStatus: { completed: 0, inProgress: 0, pending: 0 },
    leaveStatus: { approved: 0, pending: 0, rejected: 0 }
  });
  
  // Form states
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    password: '',
    role: 'employee'
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });
  
  const [newLeave, setNewLeave] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Load all data
  const loadData = async () => {
    try {
      // Load employees
      const usersRes = await axios.get('http://localhost:5000/api/users');
      setEmployees(usersRes.data);
      
      // Load tasks
      const tasksRes = await axios.post('http://localhost:5000/api/tasks/list', {
        username: user.username,
        role: user.role
      });
      setTasks(tasksRes.data);
      
      // Load leave requests
      const leavesRes = user.role === 'admin'
        ? await axios.get('http://localhost:5000/api/leaves')
        : await axios.get(`http://localhost:5000/api/leaves/user/${user._id}`);
      setLeaveRequests(leavesRes.data);
      
      // Calculate performance metrics
      const adminCount = usersRes.data.filter(u => u.role === 'admin').length;
      const employeeCount = usersRes.data.filter(u => u.role === 'employee').length;
      
      const completedTasks = tasksRes.data.filter(t => t.status === 'Completed').length;
      const inProgressTasks = tasksRes.data.filter(t => t.status === 'In Progress').length;
      const pendingTasks = tasksRes.data.filter(t => t.status === 'Pending').length;
      
      const approvedLeaves = leavesRes.data.filter(l => l.status === 'Approved').length;
      const pendingLeaves = leavesRes.data.filter(l => l.status === 'Pending').length;
      const rejectedLeaves = leavesRes.data.filter(l => l.status === 'Rejected').length;
      
      setPerformanceData({
        userCounts: { admin: adminCount, employee: employeeCount },
        taskStatus: { completed: completedTasks, inProgress: inProgressTasks, pending: pendingTasks },
        leaveStatus: { approved: approvedLeaves, pending: pendingLeaves, rejected: rejectedLeaves }
      });
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', newUser);
      setNewUser({ name: '', username: '', password: '', role: 'employee' });
      loadData();
      alert('User created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  // Assign new task
  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask);
      setNewTask({ title: '', description: '', assignedTo: '' });
      loadData();
      alert('Task assigned successfully!');
    } catch (error) {
      alert('Failed to assign task');
    }
  };

  // Submit leave request
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(newLeave.startDate);
      const endDate = new Date(newLeave.endDate);
      
      if (startDate > endDate) {
        alert('End date must be after start date');
        return;
      }

      await axios.post('http://localhost:5000/api/leaves', {
        employeeId: user._id,
        employeeName: user.name,
        username: user.username,
        reason: newLeave.reason,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate
      });
      
      setNewLeave({ startDate: '', endDate: '', reason: '' });
      loadData();
      alert('Leave request submitted successfully!');
    } catch (error) {
      alert('Failed to submit leave request');
    }
  };

  // Update leave status
  const handleLeaveStatusChange = async (leaveId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${leaveId}/status`, { status });
      loadData();
      alert(`Leave request ${status.toLowerCase()} successfully!`);
    } catch (error) {
      alert('Failed to update leave status');
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear any user data from localStorage if needed
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Call the onLogout prop
    onLogout();
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="content-section">
            <h2 className="section-title">User Management</h2>
            <form onSubmit={handleCreateUser} className="form-card">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Create User
              </button>
            </form>

            <div className="data-card">
              <h3 className="card-title">Current Users</h3>
              <div className="user-list">
                {employees.map(emp => (
                  <div key={emp._id} className="user-item">
                    <div className="user-avatar">{getInitials(emp.name)}</div>
                    <div className="user-details">
                      <h4>{emp.name}</h4>
                      <p>@{emp.username}</p>
                      <span className={`role-badge ${emp.role === 'admin' ? 'admin' : 'employee'}`}>
                        {emp.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="content-section">
            <h2 className="section-title">Task Management</h2>
            <form onSubmit={handleAssignTask} className="form-card">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select
                  className="form-input"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp.username}>
                      {emp.name} ({emp.username})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-success">
                Assign Task
              </button>
            </form>

            <div className="data-card">
              <h3 className="card-title">Task List</h3>
              <div className="task-list">
                {tasks.length === 0 ? (
                  <p className="no-data">No tasks found</p>
                ) : (
                  tasks.map(task => (
                    <div 
                      key={task._id} 
                      className={`task-item ${task.status === 'Completed' ? 'completed' : ''} ${task.status === 'In Progress' ? 'in-progress' : ''}`}
                    >
                      <div className="task-title">{task.title}</div>
                      <p className="task-desc">{task.description}</p>
                      <div className="task-meta">
                        <span>Assigned to: {task.assignedTo}</span>
                        <span className={`status-badge ${
                          task.status === 'Completed' ? 'status-approved' :
                          task.status === 'In Progress' ? 'status-pending' :
                          ''
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      
      case 'leave':
        return (
          <div className="content-section">
            <h2 className="section-title">Leave Management</h2>
            
            {user.role === 'employee' && (
              <form onSubmit={handleSubmitLeave} className="form-card">
                <h3 className="form-title">Submit Leave Request</h3>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <textarea
                    className="form-input form-textarea"
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </form>
            )}

            <div className="data-card">
              <h3 className="card-title">Leave Requests</h3>
              <div className="leave-list">
                {leaveRequests.length === 0 ? (
                  <p className="no-data">No leave requests found</p>
                ) : (
                  leaveRequests.map(leave => (
                    <div key={leave._id} className="leave-item">
                      <div className="leave-header">
                        <div>
                          <h4>{leave.employeeName}</h4>
                          <p>@{leave.username}</p>
                        </div>
                        <div>
                          <span className={`status-badge ${
                            leave.status === 'Approved' ? 'status-approved' :
                            leave.status === 'Rejected' ? 'status-rejected' :
                            'status-pending'
                          }`}>
                            {leave.status}
                          </span>
                          <p className="leave-date">
                            Applied on: {new Date(leave.appliedOn).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="leave-dates">
                        <div>
                          <span>From:</span> {new Date(leave.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span>To:</span> {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span>Days:</span> {leave.numberOfDays}
                        </div>
                      </div>
                      
                      <div className="leave-reason">
                        <p className="reason-title">Reason:</p>
                        <p>{leave.reason}</p>
                      </div>
                      
                      {user.role === 'admin' && leave.status === 'Pending' && (
                        <div className="leave-actions">
                          <button
                            onClick={() => handleLeaveStatusChange(leave._id, 'Approved')}
                            className="btn btn-success btn-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleLeaveStatusChange(leave._id, 'Rejected')}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      
      case 'performance':
        return (
          <div className="content-section">
            <h2 className="section-title">Performance Dashboard</h2>
            
            <div className="performance-grid">
              {/* User Roles Pie Chart */}
              <div className="chart-card">
                <h3>User Distribution</h3>
                <div className="chart-container">
                  <Pie
                    data={{
                      labels: ['Admins', 'Employees'],
                      datasets: [{
                        data: [performanceData.userCounts.admin, performanceData.userCounts.employee],
                        backgroundColor: ['#4e73df', '#1cc88a'],
                        hoverBackgroundColor: ['#2e59d9', '#17a673'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                      }]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Task Status Bar Chart */}
              <div className="chart-card">
                <h3>Task Status</h3>
                <div className="chart-container">
                  <Bar
                    data={{
                      labels: ['Completed', 'In Progress', 'Pending'],
                      datasets: [{
                        label: 'Tasks',
                        data: [
                          performanceData.taskStatus.completed,
                          performanceData.taskStatus.inProgress,
                          performanceData.taskStatus.pending
                        ],
                        backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
                        hoverBackgroundColor: ['#17a673', '#dda20a', '#be2617'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                      }]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Leave Status Line Chart */}
              <div className="chart-card">
                <h3>Leave Requests</h3>
                <div className="chart-container">
                  <Line
                    data={{
                      labels: ['Approved', 'Pending', 'Rejected'],
                      datasets: [{
                        label: 'Leaves',
                        data: [
                          performanceData.leaveStatus.approved,
                          performanceData.leaveStatus.pending,
                          performanceData.leaveStatus.rejected
                        ],
                        backgroundColor: 'rgba(78, 115, 223, 0.05)',
                        borderColor: 'rgba(78, 115, 223, 1)',
                        pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                        tension: 0.3
                      }]
                    }}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Summary Cards */}
              <div className="summary-card total-users">
                <div className="card-icon">
                  <UserIcon />
                </div>
                <div className="card-content">
                  <div className="card-title">Total Users</div>
                  <div className="card-value">
                    {performanceData.userCounts.admin + performanceData.userCounts.employee}
                  </div>
                </div>
              </div>
              
              <div className="summary-card total-tasks">
                <div className="card-icon">
                  <TaskIcon />
                </div>
                <div className="card-content">
                  <div className="card-title">Total Tasks</div>
                  <div className="card-value">
                    {performanceData.taskStatus.completed + 
                     performanceData.taskStatus.inProgress + 
                     performanceData.taskStatus.pending}
                  </div>
                </div>
              </div>
              
              <div className="summary-card total-leaves">
                <div className="card-icon">
                  <LeaveIcon />
                </div>
                <div className="card-content">
                  <div className="card-title">Total Leaves</div>
                  <div className="card-value">
                    {performanceData.leaveStatus.approved + 
                     performanceData.leaveStatus.pending + 
                     performanceData.leaveStatus.rejected}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="admin-panel-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar" title={user.name}>
            {getInitials(user.name)}
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role === 'admin' ? 'Administrator' : 'Employee'}</div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              <UserIcon />
              <span>Users</span>
            </li>
            <li 
              className={activeTab === 'tasks' ? 'active' : ''}
              onClick={() => setActiveTab('tasks')}
            >
              <TaskIcon />
              <span>Tasks</span>
            </li>
            <li 
              className={activeTab === 'leave' ? 'active' : ''}
              onClick={() => setActiveTab('leave')}
            >
              <LeaveIcon />
              <span>Leave Request</span>
            </li>
            <li 
              className={activeTab === 'performance' ? 'active' : ''}
              onClick={() => setActiveTab('performance')}
            >
              <PerformanceIcon />
              <span>Performance</span>
            </li>
            <li className="logout-item" onClick={handleLogout}>
              <LogoutIcon />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        <header className="content-header">
          <h1>
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'tasks' && 'Task Management'}
            {activeTab === 'leave' && 'Leave Management'}
            {activeTab === 'performance' && 'Performance Dashboard'}
          </h1>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPanel;