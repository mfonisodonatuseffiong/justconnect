import React, { useState } from 'react';
import './CancelBookingModal.css';

const CancelBookingModal = ({ onCancel, onClose }) => {
  const [reason, setReason] = useState('');

  const handleCancelClick = () => {
    if (reason.trim()) {
      onCancel(reason);   // Calls the function passed from parent (e.g., to cancel booking)
      onClose();          // Closes the modal after successful cancel
    } else {
      alert('Please enter a reason for cancellation.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="cancel-modal">
        <h2>Cancel Booking</h2>
        <p>Please tell us why you’re cancelling this booking:</p>

        <textarea
          placeholder="Enter your reason here..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>

        <div className="modal-buttons">
          <button className="btn confirm" onClick={handleCancelClick}>
            Confirm Cancel
          </button>
          <button className="btn keep" onClick={onClose}>
            Keep Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
