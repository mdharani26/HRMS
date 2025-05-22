import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveStatus = ({ userId }) => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/leaves/list', {
          role: 'employee',
          employeeId: userId
        });
        setLeaves(res.data);
      } catch (error) {
        console.error("Error fetching leaves:", error);
      }
    };

    if (userId) {
      fetchLeaves();
    }
  }, [userId]);

  return (
    <div>
      <h2>My Leave Requests</h2>
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            <strong>{leave.reason}</strong> - {leave.numberOfDays} day(s) - <b>{leave.status}</b>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveStatus;
