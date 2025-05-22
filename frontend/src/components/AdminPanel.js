import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel({ user }) {
  const [employees, setEmployees] = useState([]);
  const [newUser, setNewUser] = useState({});
  const [newTask, setNewTask] = useState({});
  const [taskList, setTaskList] = useState([]);

  const load = async () => {
    const res1 = await axios.get('http://localhost:5000/api/users');
    const res2 = await axios.post('http://localhost:5000/api/tasks/list', user);
    setEmployees(res1.data);
    setTaskList(res2.data);
  };

  useEffect(() => { load(); }, []);

  const createUser = async () => {
    await axios.post('http://localhost:5000/api/users', newUser);
    load();
  };

  const assignTask = async () => {
    await axios.post('http://localhost:5000/api/tasks', newTask);
    load();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      <div className="mt-4">
        <h3 className="font-semibold">Create User</h3>
        <input className="border p-1 m-1" placeholder="Name" onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
        <input className="border p-1 m-1" placeholder="Username" onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
        <input className="border p-1 m-1" placeholder="Password" onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
        <button className="bg-green-500 text-white px-3 py-1 m-1" onClick={() => createUser()}>Create</button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Assign Task</h3>
        <input className="border p-1 m-1" placeholder="Title" onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
        <input className="border p-1 m-1" placeholder="Description" onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
        <select className="border p-1 m-1" onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
          <option>Select Employee</option>
          {employees.map(emp => <option key={emp._id} value={emp.username}>{emp.name}</option>)}
        </select>
        <button className="bg-blue-500 text-white px-3 py-1 m-1" onClick={() => assignTask()}>Assign</button>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Task List</h3>
        {taskList.map(task => (
          <div key={task._id} className="border p-2 my-2">
            <b>{task.title}</b> → {task.assignedTo} — <i>{task.status}</i>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
