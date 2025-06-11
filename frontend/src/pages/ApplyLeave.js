import React, { useState } from 'react';
import axios from 'axios';
import './ApplyLeave.css';

const ApplyLeave = ({ userId, userName, onLeaveApplied }) => {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState('');
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const applyLeave = async () => {
    if (!reason.trim() || !days || Number(days) <= 0 || !startDate) {
      alert("Please fill in all fields correctly.");
      return;
    }

    setIsSubmitting(true);
    
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
        setShowSuccess(true);
        setTimeout(() => {
          setReason('');
          setDays('');
          setStartDate('');
          setShowSuccess(false);
          if (onLeaveApplied) onLeaveApplied();
          setIsSubmitting(false);
        }, 2000);
      } else {
        setIsSubmitting(false);
        alert('Failed to apply leave: ' + (res.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error("Leave apply error:", err.response?.data || err.message);
      setIsSubmitting(false);
      alert('Error applying leave.');
    }
  };

  return (
    <div className={`leave-application-container ${isSubmitting ? 'submitting' : ''}`}>
      <div className={`leave-card ${showSuccess ? 'success' : ''}`}>
        {showSuccess ? (
          <div className="success-state">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
            <h3>Leave Applied Successfully!</h3>
            <p>Your request has been submitted for approval</p>
          </div>
        ) : (
          <>
            <div className="card-header">
              <h2>Apply for Leave</h2>
              <p>Fill out the form to request time off</p>
            </div>
            
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  required
                  className={startDate ? 'has-value' : ''}
                />
                <span className="input-icon">
                  <i className="far fa-calendar-alt"></i>
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="days">Number of Days</label>
                <input
                  type="number"
                  id="days"
                  min="1"
                  placeholder=" "
                  value={days}
                  onChange={e => setDays(e.target.value)}
                  required
                  className={days ? 'has-value' : ''}
                />
                <span className="input-icon">
                  <i className="far fa-calendar-check"></i>
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for Leave</label>
                <textarea
                  id="reason"
                  placeholder="Briefly explain your reason for leave"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  required
                  className={reason ? 'has-value' : ''}
                  rows="3"
                />
                <span className="input-icon">
                  <i className="far fa-comment-alt"></i>
                </span>
              </div>
            </div>

            <div className="card-footer">
              <button 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                onClick={applyLeave}
                disabled={isSubmitting || !reason || !days || !startDate}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Submit Application
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyLeave;