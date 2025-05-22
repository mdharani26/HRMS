import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = () => {
    axios.get('http://localhost:5000/api/leaves')
      .then(res => setLeaves(res.data));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, status) => {
    await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
    fetchLeaves(); // Refresh list
  };

  return (
    <div>
      <h2>Admin - Manage Leave Requests</h2>
      <ul>
        {leaves.map(leave => (
          <li key={leave._id}>
            <b>{leave.employeeName}</b> - {leave.reason} ({leave.numberOfDays} days) - <b>{leave.status}</b>
            {leave.status === 'Pending' && (
              <>
                <button onClick={() => handleAction(leave._id, 'Approved')}>Approve</button>
                <button onClick={() => handleAction(leave._id, 'Rejected')}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
