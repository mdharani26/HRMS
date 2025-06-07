import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import './AdminPanel.css';

ChartJS.register(...registerables);



// SVG Icons (updated with more icons)
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

const PayrollIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
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
    role: 'employee',
    email: '',
    department: '',
    position: '',
    salary: ''
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });
  
  const [newLeave, setNewLeave] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    type: 'vacation'
  });

  // Payroll state
  const [payrollData, setPayrollData] = useState([]);
  const [newPayroll, setNewPayroll] = useState({
    employeeId: '',
    month: '',
    year: new Date().getFullYear(),
    basicSalary: '',
    bonuses: '',
    deductions: '',
    notes: ''
  });

  // Editing states
  const [editingUser, setEditingUser] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [taskFilter, setTaskFilter] = useState('all');
  const [leaveFilter, setLeaveFilter] = useState('all');

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
      
      // Load payroll data if admin
      if (user.role === 'admin') {
        const payrollRes = await axios.get('http://localhost:5000/api/payroll');
        setPayrollData(payrollRes.data);
      }
      
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
      setNewUser({ 
        name: '', 
        username: '', 
        password: '', 
        role: 'employee',
        email: '',
        department: '',
        position: '',
        salary: ''
      });
      loadData();
      alert('User created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser);
      setEditingUser(null);
      loadData();
      alert('User updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        loadData();
        alert('User deleted successfully!');
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  // Assign new task
  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', {
        ...newTask,
        assignedBy: user.username
      });
      setNewTask({ 
        title: '', 
        description: '', 
        assignedTo: '',
        priority: 'medium',
        dueDate: ''
      });
      loadData();
      alert('Task assigned successfully!');
    } catch (error) {
      alert('Failed to assign task');
    }
  };

  // Update task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, editingTask);
      setEditingTask(null);
      loadData();
      alert('Task updated successfully!');
    } catch (error) {
      alert('Failed to update task');
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
        loadData();
        alert('Task deleted successfully!');
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  // Update task status
  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}/status`, { status });
      loadData();
      alert(`Task marked as ${status.toLowerCase()}!`);
    } catch (error) {
      alert('Failed to update task status');
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
        endDate: newLeave.endDate,
        type: newLeave.type
      });
      
      setNewLeave({ 
        startDate: '', 
        endDate: '', 
        reason: '',
        type: 'vacation'
      });
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

  // Add payroll record
  const handleAddPayroll = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/payroll', newPayroll);
      setNewPayroll({
        employeeId: '',
        month: '',
        year: new Date().getFullYear(),
        basicSalary: '',
        bonuses: '',
        deductions: '',
        notes: ''
      });
      loadData();
      alert('Payroll record added successfully!');
    } catch (error) {
      alert('Failed to add payroll record');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    onLogout();
    
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';
  };

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    return task.status.toLowerCase() === taskFilter.toLowerCase();
  });

  // Filter leave requests based on status
  const filteredLeaves = leaveRequests.filter(leave => {
    if (leaveFilter === 'all') return true;
    return leave.status.toLowerCase() === leaveFilter.toLowerCase();
  });

  // Search employees
  const searchedEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get tasks for selected employee
  const employeeTasks = selectedEmployee 
    ? tasks.filter(task => task.assignedTo === selectedEmployee.username)
    : [];

  // Calculate employee performance metrics
  const getEmployeePerformance = (username) => {
    const empTasks = tasks.filter(task => task.assignedTo === username);
    const completed = empTasks.filter(t => t.status === 'Completed').length;
    const inProgress = empTasks.filter(t => t.status === 'In Progress').length;
    const pending = empTasks.filter(t => t.status === 'Pending').length;
    
    return {
      totalTasks: empTasks.length,
      completed,
      inProgress,
      pending,
      completionRate: empTasks.length > 0 ? Math.round((completed / empTasks.length) * 100) : 0
    };
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="content-section">
            <h2 className="section-title">User Management</h2>
            
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            {editingUser ? (
              <form onSubmit={handleUpdateUser} className="form-card">
                <div className="form-header">
                  <h3>Edit User</h3>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setEditingUser(null)}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.department}
                    onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingUser.position}
                    onChange={(e) => setEditingUser({...editingUser, position: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Salary ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editingUser.salary}
                    onChange={(e) => setEditingUser({...editingUser, salary: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-input"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateUser} className="form-card">
                <h3 className="form-title">Create New User</h3>
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
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.position}
                    onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Salary ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newUser.salary}
                    onChange={(e) => setNewUser({...newUser, salary: e.target.value})}
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
            )}

            <div className="data-card">
              <h3 className="card-title">Current Users</h3>
              <div className="user-list">
                {searchedEmployees.length === 0 ? (
                  <p className="no-data">No users found</p>
                ) : (
                  searchedEmployees.map(emp => (
                    <div key={emp._id} className="user-item">
                      <div className="user-avatar">{getInitials(emp.name)}</div>
                      <div className="user-details">
                        <h4>{emp.name}</h4>
                        <p>@{emp.username} • {emp.email}</p>
                        <p>{emp.position} ({emp.department})</p>
                        {emp.salary && <p>Salary: ${emp.salary}</p>}
                        <span className={`role-badge ${emp.role === 'admin' ? 'admin' : 'employee'}`}>
                          {emp.role}
                        </span>
                      </div>
                      <div className="user-actions">
                        <button 
                          onClick={() => setEditingUser(emp)}
                          className="btn-icon btn-edit"
                          title="Edit user"
                        >
                          <EditIcon />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(emp._id)}
                          className="btn-icon btn-delete"
                          title="Delete user"
                        >
                          <DeleteIcon />
                        </button>
                        <button 
                          onClick={() => setSelectedEmployee(selectedEmployee?._id === emp._id ? null : emp)}
                          className="btn btn-sm btn-view"
                        >
                          {selectedEmployee?._id === emp._id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                      
                      {selectedEmployee?._id === emp._id && (
                        <div className="employee-details">
                          <h4>Employee Details</h4>
                          
                          <div className="employee-performance">
                            <h5>Performance Metrics</h5>
                            <div className="performance-stats">
                              <div className="stat-card">
                                <span>Total Tasks</span>
                                <strong>{getEmployeePerformance(emp.username).totalTasks}</strong>
                              </div>
                              <div className="stat-card">
                                <span>Completed</span>
                                <strong>{getEmployeePerformance(emp.username).completed}</strong>
                              </div>
                              <div className="stat-card">
                                <span>Completion Rate</span>
                                <strong>{getEmployeePerformance(emp.username).completionRate}%</strong>
                              </div>
                            </div>
                            
                            <div className="chart-container-small">
                              <Doughnut
                                data={{
                                  labels: ['Completed', 'In Progress', 'Pending'],
                                  datasets: [{
                                    data: [
                                      getEmployeePerformance(emp.username).completed,
                                      getEmployeePerformance(emp.username).inProgress,
                                      getEmployeePerformance(emp.username).pending
                                    ],
                                    backgroundColor: ['#1cc88a', '#f6c23e', '#e74a3b'],
                                    hoverBackgroundColor: ['#17a673', '#dda20a', '#be2617'],
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
                          
                          <div className="employee-tasks">
                            <h5>Assigned Tasks ({employeeTasks.length})</h5>
                            {employeeTasks.length === 0 ? (
                              <p className="no-data">No tasks assigned</p>
                            ) : (
                              <div className="task-list">
                                {employeeTasks.map(task => (
                                  <div key={task._id} className="task-item">
                                    <div className="task-title">{task.title}</div>
                                    <p className="task-desc">{task.description}</p>
                                    <div className="task-meta">
                                      <span>Status: {task.status}</span>
                                      <span>Priority: {task.priority}</span>
                                      {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="content-section">
            <h2 className="section-title">Task Management</h2>
            
            <div className="filter-bar">
              <select
                className="filter-select"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            {editingTask ? (
              <form onSubmit={handleUpdateTask} className="form-card">
                <div className="form-header">
                  <h3>Edit Task</h3>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setEditingTask(null)}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="form-group">
                  <label className="form-label">Task Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-input"
                    value={editingTask.assignedTo}
                    onChange={(e) => setEditingTask({...editingTask, assignedTo: e.target.value})}
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
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editingTask.dueDate?.split('T')[0] || ''}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({...editingTask, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
              </form>
            ) : (
              <form onSubmit={handleAssignTask} className="form-card">
                <h3 className="form-title">Assign New Task</h3>
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
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Assign Task
                </button>
              </form>
            )}

            <div className="data-card">
              <h3 className="card-title">Task List</h3>
              <div className="task-list">
                {filteredTasks.length === 0 ? (
                  <p className="no-data">No tasks found</p>
                ) : (
                  filteredTasks.map(task => (
                    <div 
                      key={task._id} 
                      className={`task-item ${task.status === 'Completed' ? 'completed' : ''} ${task.status === 'In Progress' ? 'in-progress' : ''}`}
                    >
                      <div className="task-header">
                        <div className="task-title">{task.title}</div>
                        <div className="task-actions">
                          <button 
                            onClick={() => setEditingTask(task)}
                            className="btn-icon btn-edit"
                            title="Edit task"
                          >
                            <EditIcon />
                          </button>
                          <button 
                            onClick={() => handleDeleteTask(task._id)}
                            className="btn-icon btn-delete"
                            title="Delete task"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                      <p className="task-desc">{task.description}</p>
                      <div className="task-meta">
                        <div>
                          <span>Assigned to: {task.assignedTo}</span>
                          <span>Priority: 
                            <span className={`priority-badge ${task.priority}`}>
                              {task.priority}
                            </span>
                          </span>
                          {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                        </div>
                        <div className="task-status">
                          <span className={`status-badge ${
                            task.status === 'Completed' ? 'status-approved' :
                            task.status === 'In Progress' ? 'status-pending' :
                            ''
                          }`}>
                            {task.status}
                          </span>
                          {task.status !== 'Completed' && (
                            <button
                              onClick={() => handleTaskStatusChange(task._id, 'Completed')}
                              className="btn btn-sm btn-complete"
                            >
                              Mark Complete
                            </button>
                          )}
                        </div>
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
            
            <div className="filter-bar">
              <select
                className="filter-select"
                value={leaveFilter}
                onChange={(e) => setLeaveFilter(e.target.value)}
              >
                <option value="all">All Requests</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
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
                  <label className="form-label">Leave Type</label>
                  <select
                    className="form-input"
                    value={newLeave.type}
                    onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                  >
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
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
                {filteredLeaves.length === 0 ? (
                  <p className="no-data">No leave requests found</p>
                ) : (
                  filteredLeaves.map(leave => (
                    <div key={leave._id} className="leave-item">
                      <div className="leave-header">
                        <div>
                          <h4>{leave.employeeName}</h4>
                          <p>@{leave.username}</p>
                          <span className="leave-type">{leave.type}</span>
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
              
              {/* Top Performers */}
              <div className="chart-card top-performers">
                <h3>Top Performers</h3>
                <div className="performers-list">
                  {employees
                    .filter(emp => emp.role === 'employee')
                    .map(emp => ({
                      ...emp,
                      completionRate: getEmployeePerformance(emp.username).completionRate
                    }))
                    .sort((a, b) => b.completionRate - a.completionRate)
                    .slice(0, 5)
                    .map((emp, index) => (
                      <div key={emp._id} className="performer-item">
                        <div className="performer-rank">{index + 1}</div>
                        <div className="performer-avatar">{getInitials(emp.name)}</div>
                        <div className="performer-details">
                          <h4>{emp.name}</h4>
                          <p>{emp.position}</p>
                        </div>
                        <div className="performer-stats">
                          <div className="completion-rate">
                            {emp.completionRate}%
                          </div>
                          <div className="tasks-count">
                            {getEmployeePerformance(emp.username).totalTasks} tasks
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'payroll':
        return (
          <div className="content-section">
            <h2 className="section-title">Payroll Management</h2>
            
            <form onSubmit={handleAddPayroll} className="form-card">
              <h3 className="form-title">Add Payroll Record</h3>
              <div className="form-group">
                <label className="form-label">Employee</label>
                <select
                  className="form-input"
                  value={newPayroll.employeeId}
                  onChange={(e) => setNewPayroll({...newPayroll, employeeId: e.target.value})}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.filter(e => e.role === 'employee').map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} (${emp.salary || '0'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Month</label>
                  <select
                    className="form-input"
                    value={newPayroll.month}
                    onChange={(e) => setNewPayroll({...newPayroll, month: e.target.value})}
                    required
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newPayroll.year}
                    onChange={(e) => setNewPayroll({...newPayroll, year: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Basic Salary ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newPayroll.basicSalary}
                    onChange={(e) => setNewPayroll({...newPayroll, basicSalary: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Bonuses ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newPayroll.bonuses}
                    onChange={(e) => setNewPayroll({...newPayroll, bonuses: e.target.value || '0'})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Deductions ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newPayroll.deductions}
                    onChange={(e) => setNewPayroll({...newPayroll, deductions: e.target.value || '0'})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input form-textarea"
                  value={newPayroll.notes}
                  onChange={(e) => setNewPayroll({...newPayroll, notes: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Payroll Record
              </button>
            </form>

            <div className="data-card">
              <h3 className="card-title">Payroll Records</h3>
              <div className="payroll-table-container">
                <table className="payroll-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Period</th>
                      <th>Basic Salary</th>
                      <th>Bonuses</th>
                      <th>Deductions</th>
                      <th>Net Salary</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="no-data">No payroll records found</td>
                      </tr>
                    ) : (
                      payrollData.map(payroll => {
                        const employee = employees.find(e => e._id === payroll.employeeId);
                        const netSalary = (
                          parseFloat(payroll.basicSalary) + 
                          parseFloat(payroll.bonuses || 0) - 
                          parseFloat(payroll.deductions || 0)
                        ).toFixed(2);
                        
                        return (
                          <tr key={payroll._id}>
                            <td>{employee?.name || 'Unknown'}</td>
                            <td>{payroll.month} {payroll.year}</td>
                            <td>${payroll.basicSalary}</td>
                            <td>${payroll.bonuses || '0.00'}</td>
                            <td>${payroll.deductions || '0.00'}</td>
                            <td>${netSalary}</td>
                            <td className="notes-cell">{payroll.notes || '-'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
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
            {user.role === 'admin' && (
              <li 
                className={activeTab === 'payroll' ? 'active' : ''}
                onClick={() => setActiveTab('payroll')}
              >
                <PayrollIcon />
                <span>Payroll</span>
              </li>
            )}
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
            {activeTab === 'payroll' && 'Payroll Management'}
          </h1>
        </header>
        
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminPanel;