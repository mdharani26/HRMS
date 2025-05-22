import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // import for navigation

function EmployeePanel({ user }) {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const loadTasks = async () => {
    const res = await axios.post('http://localhost:5000/api/tasks/list', user);
    setTasks(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/tasks/${id}/status`, { status });
    loadTasks();
  };

  useEffect(() => { loadTasks(); }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Welcome, {user.name}</h2>

      {/* Leave Management Buttons */}
      <div className="my-4">
        <button 
          onClick={() => navigate(`/leave/apply?userId=${user._id}&userName=${user.name}`)} 
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Apply for Leave
        </button>
        <button 
          onClick={() => navigate(`/leave/status?userId=${user._id}`)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          View Leave Status
        </button>
      </div>

      {/* Task List */}
      {tasks.map(task => (
        <div key={task._id} className="border p-2 my-2">
          <b>{task.title}</b>
          <p>{task.description}</p>
          <p>Status: <i>{task.status}</i></p>
          <select
            value={task.status}
            onChange={e => updateStatus(task._id, e.target.value)}
            className="border p-1 mt-1"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default EmployeePanel;
