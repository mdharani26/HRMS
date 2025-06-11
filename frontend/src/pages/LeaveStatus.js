import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FiRefreshCw, 
  FiCalendar, 
  FiEdit2, 
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiLoader
} from 'react-icons/fi';
import './LeaveStatus.css';

function LeaveStatus({ userId }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaves/user/${userId}`);
      setLeaves(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave requests');
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaves();
  };

  useEffect(() => {
    fetchLeaves();
    const interval = setInterval(fetchLeaves, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return <FiCheckCircle className="status-icon" />;
      case 'pending':
        return <FiLoader className="status-icon spin" />;
      case 'rejected':
        return <FiXCircle className="status-icon" />;
      default:
        return <FiAlertCircle className="status-icon" />;
    }
  };

  if (loading) return (
    <div className="leave-status-loading">
      <div className="loading-spinner">
        <FiLoader className="spin" size={32} />
      </div>
      <p>Loading your leave requests...</p>
    </div>
  );

  if (error) return (
    <div className="leave-status-error">
      <div className="error-icon">
        <FiAlertCircle size={40} />
      </div>
      <p>{error}</p>
      <button onClick={handleRefresh} className="retry-btn">
        Try Again
      </button>
    </div>
  );

  return (
    <div className="leave-status-container">
      <div className="leave-status-header">
        <h2>Your Leave Requests</h2>
        <button 
          onClick={handleRefresh} 
          className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
          disabled={refreshing}
        >
          {refreshing ? (
            <FiLoader className="spin" />
          ) : (
            <FiRefreshCw />
          )}
          <span>Refresh</span>
        </button>
      </div>

      {leaves.length === 0 ? (
        <div className="leave-status-empty">
          <div className="empty-icon">
            <FiCalendar size={48} />
          </div>
          <h3>No Leave Requests Yet</h3>
          <p>You haven't submitted any leave requests.</p>
        </div>
      ) : (
        <div className="leave-cards-wrapper">
          {leaves.map((leave, index) => (
            <div 
              key={leave._id} 
              className="leave-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="leave-card-header">
                <div className="date-range">
                  <div className="date-icon">
                    <FiCalendar size={20} />
                  </div>
                  <div>
                    <h3>
                      {new Date(leave.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })} - {new Date(leave.endDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="leave-days">
                      {leave.numberOfDays} day{leave.numberOfDays !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className={`leave-status-badge ${leave.status.toLowerCase()}`}>
                  {getStatusIcon(leave.status)}
                  {leave.status}
                </span>
              </div>

              <div className="leave-reason">
                <div className="reason-icon">
                  <FiEdit2 size={18} />
                </div>
                <div>
                  <strong>Reason:</strong>
                  <p>{leave.reason}</p>
                </div>
              </div>

              <div className="leave-footer">
                <div className="leave-applied-date">
                  <span className="applied-icon">
                    <FiClock size={16} />
                  </span>
                  Applied on: {new Date(leave.appliedOn).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeaveStatus;