const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// === DB Connection ===
mongoose.connect('mongodb://127.0.0.1:27017/employeeTaskDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// === MongoDB Schemas ===
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

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employeeName: String,
  reason: String,
  numberOfDays: Number,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedOn: { type: Date, default: Date.now }
});

// === Models ===
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const LeaveRequest = mongoose.model('LeaveRequest', leaveSchema);

// === Routes ===

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) return res.json({ success: true, user });
  return res.json({ success: false, message: "Invalid credentials" });
});

// Create User (Admin)
app.post('/api/users', async (req, res) => {
  const { name, username, password, role } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.json({ success: false, message: "Username already exists" });

  const user = new User({ name, username, password, role });
  await user.save();
  res.json({ success: true, user });
});

// Get All Employees (Admin)
app.get('/api/users', async (req, res) => {
  const users = await User.find({ role: 'employee' });
  res.json(users);
});

// Assign Task (Admin)
app.post('/api/tasks', async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const task = new Task({ title, description, assignedTo });
  await task.save();
  res.json({ success: true, task });
});

// Task List (Admin sees all, Employee sees own)
app.post('/api/tasks/list', async (req, res) => {
  const { username, role } = req.body;
  const tasks = role === 'admin'
    ? await Task.find()
    : await Task.find({ assignedTo: username });
  res.json(tasks);
});

// Update Task Status (Employee)
app.put('/api/tasks/:id/status', async (req, res) => {
  const { status } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ success: true, task });
});

// Apply for Leave (Employee)
app.post('/leave/apply', async (req, res) => {
  const { employeeId, employeeName, reason, numberOfDays } = req.body;

  // Basic validation
  if (!employeeId || !reason || !numberOfDays) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const leave = new LeaveRequest({
      employeeId,
      employeeName,
      reason,
      numberOfDays
    });
    await leave.save();
    res.status(201).json({ success: true, leave });
  } catch (err) {
    console.error("Error applying leave:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update Leave Status (Admin)
app.put('/api/leaves/:id/status', async (req, res) => {
  const { status } = req.body;
  const leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json({ success: true, leave });
});

// View Leave Requests (Admin all, Employee own)
app.post('/api/leaves/list', async (req, res) => {
  const { role, employeeId } = req.body;
  const leaves = role === 'admin'
    ? await LeaveRequest.find()
    : await LeaveRequest.find({ employeeId });
  res.json(leaves);
});

// === Start Server ===
app.listen(5000, () => console.log("✅ Server started on http://localhost:5000"));
