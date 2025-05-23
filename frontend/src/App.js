import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import EmployeePanel from './pages/EmployeePanel';

import ApplyLeave from './pages/ApplyLeave';
import LeaveStatus from './pages/LeaveStatus';
import ManageLeaves from './pages/ManageLeaves';
import LandingPage from './pages/LandingPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Show Landing Page on / */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page only on /login */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            user?.role === 'admin' ? (
              <AdminPanel user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin/leaves"
          element={
            user?.role === 'admin' ? <ManageLeaves /> : <Navigate to="/login" />
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee"
          element={
            user?.role === 'employee' ? (
              <EmployeePanel user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leave/apply"
          element={
            user?.role === 'employee' ? (
              <ApplyLeave userId={user._id} userName={user.name} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leave/status"
          element={
            user?.role === 'employee' ? (
              <LeaveStatus userId={user._id} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
