import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import EmployeePanel from './components/EmployeePanel';

import ApplyLeave from './components/ApplyLeave';
import LeaveStatus from './components/LeaveStatus';
import ManageLeaves from './components/ManageLeaves';
import LandingPage from './components/LandingPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} />
          ) : (
            <LandingPage />
          )
        } />

        {/* Login Page */}
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          user?.role === 'admin' ? <AdminPanel user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/admin/leaves" element={
          user?.role === 'admin' ? <ManageLeaves /> : <Navigate to="/login" />
        } />

        {/* Employee Routes */}
        <Route path="/employee" element={
          user?.role === 'employee' ? <EmployeePanel user={user} /> : <Navigate to="/login" />
        } />
        <Route path="/leave/apply" element={
          user?.role === 'employee' ? (
            <ApplyLeave userId={user._id} userName={user.name} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/leave/status" element={
          user?.role === 'employee' ? (
            <LeaveStatus userId={user._id} />
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
