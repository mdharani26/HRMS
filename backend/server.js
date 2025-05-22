const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/employeeTaskDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// === MongoDB Models ===
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' }
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String, // username
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// === API Routes ===

// Simple login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) return res.json({ success: true, user });
  return res.json({ success: false, message: "Invalid credentials" });
});

// Admin: create user
app.post('/api/users', async (req, res) => {
  const { name, username, password, role } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: "Username already exists" });

  const user = new User({ name, username, password, role });
  await user.save();
  res.json({ success: true, user });
});

// Admin: get all employees
app.get('/api/users', async (req, res) => {
  const users = await User.find({ role: 'employee' });
  res.json(users);
});

// Admin: assign task
app.post('/api/tasks', async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const task = new Task({ title, description, assignedTo });
  await task.save();
  res.json({ success: true, task });
});

// Get tasks (admin sees all, employee sees own)
app.post('/api/tasks/list', async (req, res) => {
  const { username, role } = req.body;
  const tasks = role === 'admin'
    ? await Task.find()
    : await Task.find({ assignedTo: username });
  res.json(tasks);
});

// Employee: update task status
app.put('/api/tasks/:id/status', async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ success: true, task });
});

// Start server
app.listen(5000, () => console.log("Server started on http://localhost:5000"));
