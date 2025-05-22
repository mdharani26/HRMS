import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel({ user }) {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  
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
    } catch (error) {
      alert('Failed to submit leave request');
    }
  };

  // Update leave status
  const handleLeaveStatusChange = async (leaveId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${leaveId}/status`, { status });
      loadData();
    } catch (error) {
      alert('Failed to update leave status');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* User Creation Section */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
          />
          <select
            className="w-full p-2 border rounded"
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create User
          </button>
        </form>
      </section>

      {/* Task Assignment Section */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Assign Task</h2>
        <form onSubmit={handleAssignTask} className="space-y-3">
          <input
            type="text"
            placeholder="Task Title"
            className="w-full p-2 border rounded"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            required
          />
          <select
            className="w-full p-2 border rounded"
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
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Assign Task
          </button>
        </form>
      </section>

      {/* Tasks List Section */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found</p>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="p-3 border rounded bg-white">
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Assigned to: {task.assignedTo}</span>
                  <span className={`px-2 py-1 rounded ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Leave Management Section */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
        
        {/* Leave Request Form (for employees) */}
        {user.role === 'employee' && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium mb-3">Submit Leave Request</h3>
            <form onSubmit={handleSubmitLeave} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Submit Leave Request
              </button>
            </form>
          </div>
        )}

        {/* Leave Requests List */}
        <div className="space-y-3">
          {leaveRequests.length === 0 ? (
            <p className="text-gray-500">No leave requests found</p>
          ) : (
            leaveRequests.map(leave => (
              <div key={leave._id} className="p-4 border rounded bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <h3 className="font-medium">{leave.employeeName}</h3>
                    <p className="text-sm text-gray-600">@{leave.username}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-sm ${
                      leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied on: {new Date(leave.appliedOn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-2">
                  <div>
                    <span className="font-medium">From:</span> {new Date(leave.startDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {new Date(leave.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Days:</span> {leave.numberOfDays}
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="font-medium">Reason:</p>
                  <p className="text-gray-700">{leave.reason}</p>
                </div>
                
                {/* Admin actions */}
                {user.role === 'admin' && leave.status === 'Pending' && (
                  <div className="flex space-x-2 mt-3 pt-2 border-t">
                    <button
                      onClick={() => handleLeaveStatusChange(leave._id, 'Approved')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleLeaveStatusChange(leave._id, 'Rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminPanel;