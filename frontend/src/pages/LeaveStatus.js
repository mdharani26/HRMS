import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    
    // Optional: Refresh every 30 seconds
    const interval = setInterval(fetchLeaves, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Leave Requests</h2>
        <button
          onClick={fetchLeaves}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
      
      {leaves.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          You haven't submitted any leave requests yet.
        </div>
      ) : (
        <div className="space-y-3">
          {leaves.map(leave => (
            <div key={leave._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {leave.numberOfDays} day{leave.numberOfDays !== 1 ? 's' : ''}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {leave.status}
                </span>
              </div>
              
              <div className="mb-2">
                <p className="font-medium">Reason:</p>
                <p className="text-gray-700">{leave.reason}</p>
              </div>
              
              <div className="text-sm text-gray-500">
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