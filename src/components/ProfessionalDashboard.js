import React from 'react';
import './Profession.css';
import './Dashboard.css';

const ProfessionalDashboard = ({ bookingRequests, updateBookingStatus }) => {
  return (
    <div className="dashboard">
      <h2>Professional Dashboard</h2>
      {bookingRequests.length > 0 ? (
        <div className="grid-container">
          {bookingRequests.map((request) => (
            <div className="grid-item" key={request.id}>
              <h3>Booking Request</h3>
              <p><strong>User:</strong> {request.user}</p>
              <p><strong>Contact:</strong> {request.contact}</p>
              <p><strong>Address:</strong> {request.address}</p>
              <p><strong>Job Details:</strong> {request.jobDetails}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`status ${
                    request.status === 'Accepted'
                      ? 'accepted'
                      : request.status === 'Declined'
                      ? 'declined'
                      : 'pending'
                  }`}
                >
                  {request.status || 'Pending'}
                </span>
              </p>
              <p><strong>Date:</strong> {request.date || 'Not provided'}</p>
              <p><strong>Time:</strong> {request.time || 'Not provided'}</p>
              <div className="action-buttons">
                <button
                  className="btn request"
                  disabled={request.status === 'Accepted'} // Disable Accept if already Accepted
                  onClick={() => {
                    updateBookingStatus(
                      request.id, // Use the unique request ID to identify this request
                      'Accepted'
                    );
                  }}
                >
                  Accept
                </button>
                <button
                  className="btn decline"
                  disabled={request.status === 'Declined'} // Disable Decline if already Declined
                  onClick={() => {
                    updateBookingStatus(
                      request.id, // Use the unique request ID to identify this request
                      'Declined'
                    );
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No booking requests available.</p>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
