import React, { useState } from 'react';
import NotificationComponent from './NotificationComponent';

const ParentComponent = () => {
  const [notification, setNotification] = useState(null);

  const handleNewBooking = () => {
    // Booking logic
    setNotification('New booking received!');

    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div>
      <button onClick={handleNewBooking}>Book Now</button>
      {notification && <NotificationComponent message={notification} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default ParentComponent;
