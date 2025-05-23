import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LeaveStatus.css'; // Import CSS

function LeaveStatus({ userId }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/leaves/user/${userId}`);
      setLeaves(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave requests');
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    const interval = setInterval(fetchLeaves, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) return <div className="leave-status-message">Loading...</div>;
  if (error) return <div className="leave-status-error">{error}</div>;

  return (
    <div className="leave-status-container">
      <div className="leave-status-header">
        <h2>Your Leave Requests</h2>
        <button onClick={fetchLeaves}>Refresh</button>
      </div>

      {leaves.length === 0 ? (
        <div className="leave-status-empty">You haven't submitted any leave requests yet.</div>
      ) : (
        <div className="leave-cards-wrapper">
          {leaves.map(leave => (
            <div key={leave._id} className="leave-card">
              <div className="leave-card-header">
                <div>
                  <h3>
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </h3>
                  <p className="leave-days">
                    {leave.numberOfDays} day{leave.numberOfDays !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`leave-status-badge ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </span>
              </div>

              <div className="leave-reason">
                <strong>Reason:</strong>
                <p>{leave.reason}</p>
              </div>

              <div className="leave-applied-date">
                Applied on: {new Date(leave.appliedOn).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaveStatus;
