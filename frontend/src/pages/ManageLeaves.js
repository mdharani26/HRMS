import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = () => {
    axios.get('http://localhost:5000/leave/all')
      .then(res => setLeaves(res.data.leaves));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/leave/update/${id}`, { status });
    fetchLeaves();
  };

  return (
    <div>
      <h2>Manage Leave Requests</h2>
      <ul>
        {leaves.map(leave => (
          <li key={leave._id}>
            <b>{leave.employeeName}</b> → {leave.reason} ({leave.numberOfDays} days) → <b>{leave.status}</b>
            <br />
            {leave.status === 'Pending' && (
              <>
                <button onClick={() => updateStatus(leave._id, 'Approved')}>Approve</button>
                <button onClick={() => updateStatus(leave._id, 'Rejected')}>Reject</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageLeaves;
