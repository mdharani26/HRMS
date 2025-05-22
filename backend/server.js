const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect('mongodb://127.0.0.1:27017/employeeTaskDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
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
  username: String,
  reason: String,
  startDate: Date,
  endDate: Date,
  numberOfDays: Number,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedOn: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const LeaveRequest = mongoose.model('LeaveRequest', leaveSchema);

// Routes

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// User Management
app.post('/api/users', async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ success: false, message: "Username exists" });

    const user = new User({ name, username, password, role });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Task Management
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({ title, description, assignedTo });
    await task.save();
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post('/api/tasks/list', async (req, res) => {
  try {
    const { username, role } = req.body;
    const tasks = role === 'admin'
      ? await Task.find()
      : await Task.find({ assignedTo: username });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Leave Management
app.post('/api/leaves', async (req, res) => {
  try {
    const { employeeId, employeeName, username, reason, startDate, endDate } = req.body;
    
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = new LeaveRequest({
      employeeId,
      employeeName,
      username,
      reason,
      startDate: start,
      endDate: end,
      numberOfDays,
      status: 'Pending'
    });

    await leave.save();
    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put('/api/leaves/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/leaves/user/:userId', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employeeId: req.params.userId })
      .sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/leaves', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find().sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));