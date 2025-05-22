import React, { useState } from 'react';
import axios from 'axios';

const ApplyLeave = ({ userId, userName }) => {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('');

  const applyLeave = async () => {
    if (!reason || !days) {
      alert("Please fill in both reason and number of days");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/leave/apply', {
        employeeId: userId,
        employeeName: userName,
        reason,
        numberOfDays: Number(days)
      });

      if (res.data.success) {
        alert('Leave Applied Successfully');
        setReason('');
        setDays('');
      } else {
        alert('Failed to apply leave: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error("Leave apply error:", err.response?.data || err.message);
      alert('Error applying leave');
    }
  };

  return (
    <div>
      <h2>Apply for Leave</h2>
            <input
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <input
        placeholder="No. of Days"
        type="number"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        min="1"
      />
      <button onClick={applyLeave}>Submit</button>
    </div>
  );
};

export default ApplyLeave;

