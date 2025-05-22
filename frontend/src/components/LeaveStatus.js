import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LeaveStatus({ userId }) {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/leaves/user/${userId}`);
        setLeaves(res.data);
      } catch (error) {
        console.error('Error fetching leave status:', error);
      }
    };

    fetchLeaves();
  }, [userId]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Leave Requests</h2>
      {leaves.length === 0 ? (
        <p>You have no leave requests.</p>
      ) : (
        leaves.map(leave => (
          <div key={leave._id} className="border p-3 mb-2 rounded">
            <p><b>Reason:</b> {leave.reason}</p>
            <p><b>Number of Days:</b> {leave.numberOfDays}</p>
            <p><b>Status:</b> <i>{leave.status}</i></p>
            <p><b>Applied At:</b> {new Date(leave.appliedAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default LeaveStatus;
