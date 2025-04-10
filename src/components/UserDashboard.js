import React from 'react';
import './UserDashboard.css';

const UserDashboard = ({ bookingRequests }) => {
  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      <p>Welcome to your dashboard! Here's a summary of your bookings:</p>

      {bookingRequests.length > 0 ? (
        <div className="bookings-container">
          {bookingRequests.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <h3>{booking.jobDetails} Service</h3>
              <p><strong>Professional:</strong> {booking.professional}</p>
              <p><strong>Contact:</strong> {booking.professionalContact}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>

              {/* Show status message based on individual booking */}
              {booking.status === 'Declined' && (
                <div className="notification-modal declined">
                  <p>Unfortunately, the professional is not available at the moment. Your booking request has been declined.</p>
                </div>
              )}
              {booking.status === 'Accepted' && (
                <div className="notification-modal accepted">
                  <p>Great news! Your booking request has been accepted. The professional will contact you shortly.</p>
                </div>
              )}
              {booking.status === 'Pending' && (
                <div className="notification-modal pending">
                  <p>Your booking request is pending. A professional will review it soon.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings available.</p>
      )}
    </div>
  );
};

export default UserDashboard;
