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
  email: { type: String, unique: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: String,
  position: String,
  salary: Number,
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String, // username
  assignedBy: String, // username of admin who assigned
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const leaveSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  employeeName: String,
  username: String,
  reason: String,
  type: { type: String, enum: ['vacation', 'sick', 'personal', 'other'], default: 'vacation' },
  startDate: Date,
  endDate: Date,
  numberOfDays: Number,
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  appliedOn: { type: Date, default: Date.now }
});

const payrollSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  month: String,
  year: Number,
  basicSalary: Number,
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const LeaveRequest = mongoose.model('LeaveRequest', leaveSchema);
const Payroll = mongoose.model('Payroll', payrollSchema);

// Routes

const handleLogout = () => {
  try {
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Call the onLogout prop function to handle the logout state in the parent component
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      console.error('onLogout is not a function');
      // Fallback in case onLogout isn't properly passed
      window.location.href = '/login'; // Redirect to login page
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Fallback in case of any error
    window.location.href = '/login'; // Redirect to login page
  }
};

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    
    res.json({ 
      success: true, 
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email,
        department: user.department,
        position: user.position,
        salary: user.salary
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// User Management
app.post('/api/users', async (req, res) => {
  try {
    const { name, username, password, role, email, department, position, salary } = req.body;
    
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: existing.username === username ? "Username exists" : "Email exists" 
      });
    }

    const user = new User({ 
      name, 
      username, 
      password, 
      role, 
      email,
      department,
      position,
      salary
    });

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, username, email, role, department, position, salary } = req.body;
    
    const existing = await User.findOne({ 
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ username }, { email }] }
      ]
    });
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: existing.username === username ? "Username exists" : "Email exists" 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, username, email, role, department, position, salary },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Task Management
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const task = new Task({ 
      title, 
      description, 
      assignedTo,
      assignedBy: req.body.username, // Pass username from frontend
      priority,
      dueDate
    });
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
      ? await Task.find().sort({ createdAt: -1 })
      : await Task.find({ assignedTo: username }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate, status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, assignedTo, priority, dueDate, status },
      { new: true }
    );
    res.json({ success: true, task });
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

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Leave Management
app.post('/api/leaves', async (req, res) => {
  try {
    const { employeeId, employeeName, username, reason, startDate, endDate, type } = req.body;
    
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = new LeaveRequest({
      employeeId,
      employeeName,
      username,
      reason,
      type,
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

// Payroll Management
app.post('/api/payroll', async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, bonuses, deductions, notes } = req.body;
    
    const payroll = new Payroll({
      employeeId,
      month,
      year,
      basicSalary,
      bonuses,
      deductions,
      notes
    });

    await payroll.save();
    res.json({ success: true, payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/payroll', async (req, res) => {
  try {
    const payrolls = await Payroll.find().populate('employeeId', 'name email position salary');
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Performance Dashboard
app.get('/api/performance/users', async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ role: 'admin' });
    const employeeCount = await User.countDocuments({ role: 'employee' });
    
    res.json({ admin: adminCount, employee: employeeCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/performance/tasks', async (req, res) => {
  try {
    const completed = await Task.countDocuments({ status: 'Completed' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const pending = await Task.countDocuments({ status: 'Pending' });
    
    res.json({ completed, inProgress, pending });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/performance/leaves', async (req, res) => {
  try {
    const approved = await LeaveRequest.countDocuments({ status: 'Approved' });
    const pending = await LeaveRequest.countDocuments({ status: 'Pending' });
    const rejected = await LeaveRequest.countDocuments({ status: 'Rejected' });
    
    res.json({ approved, pending, rejected });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get('/api/performance/employee/:username', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.username });
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    
    res.json({
      totalTasks: tasks.length,
      completed,
      inProgress,
      pending,
      completionRate
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));