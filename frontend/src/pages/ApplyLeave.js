import React, { useState } from 'react';
import axios from 'axios';

const ApplyLeave = ({ userId, userName, onLeaveApplied }) => {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('');
  const [startDate, setStartDate] = useState('');

  const applyLeave = async () => {
    if (!reason.trim() || !days || Number(days) <= 0 || !startDate) {
      alert("Please fill in a valid reason, start date, and number of days.");
      return;
    }

    // Calculate endDate by adding days - 1 to startDate
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + Number(days) - 1);

    try {
      const res = await axios.post('http://localhost:5000/api/leaves', {
        employeeId: userId,
        employeeName: userName,
        username: userName, // assuming username = userName here
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
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>

      <input
        className="border p-2 mb-2 w-full"
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        placeholder="Start Date"
      />

      <input
        className="border p-2 mb-2 w-full"
        placeholder="Reason"
        value={reason}
        onChange={e => setReason(e.target.value)}
      />

      <input
        className="border p-2 mb-4 w-full"
        placeholder="Number of Days"
        type="number"
        min="1"
        value={days}
        onChange={e => setDays(e.target.value)}
      />

      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={applyLeave}
      >
        Submit
      </button>
    </div>
  );
};

export default ApplyLeave;
