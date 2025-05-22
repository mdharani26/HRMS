import React, { useState } from 'react';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import EmployeePanel from './components/EmployeePanel';

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <Login setUser={setUser} />;
  return user.role === 'admin'
    ? <AdminPanel user={user} />
    : <EmployeePanel user={user} />;
}

export default App;
