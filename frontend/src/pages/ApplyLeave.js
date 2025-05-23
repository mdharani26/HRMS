import React, { useState } from 'react';
import axios from 'axios';
import './ApplyLeave.css'; // Importing CSS file

const ApplyLeave = ({ userId, userName, onLeaveApplied }) => {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('');
  const [startDate, setStartDate] = useState('');

  const applyLeave = async () => {
    if (!reason.trim() || !days || Number(days) <= 0 || !startDate) {
      alert("Please fill in a valid reason, start date, and number of days.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + Number(days) - 1);

    try {
      const res = await axios.post('http://localhost:5000/api/leaves', {
        employeeId: userId,
        employeeName: userName,
        username: userName,
        reason,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });

      if (res.data.success) {
        alert('Leave applied successfully.');
        setReason('');
        setDays('');
        setStartDate('');
        if (onLeaveApplied) onLeaveApplied();
      } else {
        alert('Failed to apply leave: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error("Leave apply error:", err.response?.data || err.message);
      alert('Error applying leave.');
    }
  };

  return (
    <div className="apply-leave-container">
      <h2>Apply for Leave</h2>

      <div className="form-group">
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Reason:</label>
        <input
          type="text"
          placeholder="Enter reason"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Number of Days:</label>
        <input
          type="number"
          min="1"
          placeholder="Enter number of days"
          value={days}
          onChange={e => setDays(e.target.value)}
        />
      </div>

      <button className="submit-btn" onClick={applyLeave}>Submit</button>
    </div>
  );
};

export default ApplyLeave;
