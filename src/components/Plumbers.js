import React, { useState } from 'react';
import './Profession.css'; // Styles for grid, modal, and stars
import profile from '../assets/profile.jpg'; // Default profile image for John Doe
import defaultAvatar from '../assets/default-avatar.png'; // Default avatar for missing photos

const Plumbers = ({ onBookingRequest }) => {
  const [plumbers, setPlumbers] = useState([
    {
      id: 1,
      name: 'Mfoniso Donatus',
      experience: '5 years',
      contact: '+2348054343141',
      photo: profile,
      rating: 4.5,
      ratingCount: 10,
    },
    {
      id: 2,
      name: 'Jane Smith',
      experience: '8 years',
      contact: '987-654-3210',
      photo: defaultAvatar,
      rating: 4.8,
      ratingCount: 15,
    },
    {
      id: 3,
      name: 'Mike Johnson',
      experience: '3 years',
      contact: '456-789-0123',
      photo: defaultAvatar,
      rating: 4.2,
      ratingCount: 5,
    },
    {
      id: 4,
      name: 'Emily Davis',
      experience: '6 years',
      contact: '321-654-9870',
      photo: defaultAvatar,
      rating: 4.7,
      ratingCount: 12,
    },
    {
      id: 5,
      name: 'David Wilson',
      experience: '10 years',
      contact: '654-321-0987',
      photo: defaultAvatar,
      rating: 4.9,
      ratingCount: 20,
    },
    {
      id: 6,
      name: 'Sarah Brown',
      experience: '2 years',
      contact: '789-012-3456',
      photo: defaultAvatar,
      rating: 4.1,
      ratingCount: 7,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlumber, setSelectedPlumber] = useState(null);
  const [notification, setNotification] = useState('');

  // Handle booking selection
  const handleSelect = (plumber) => {
    setSelectedPlumber(plumber);
    setShowModal(true);
  };

  // Handle booking request submission
  const handleBookingRequest = (event) => {
    event.preventDefault();
    const bookingDetails = {
      user: event.target.name.value, // User name
      contact: event.target.phone.value, // User contact
      address: event.target.address.value, // User address
      jobDetails: event.target.jobDetails.value, // Job details
      professionalId: selectedPlumber.id, // Professional ID
      professional: selectedPlumber.name, // Professional name
      professionalContact: selectedPlumber.contact, // Professional contact
      date: new Date().toLocaleDateString(), // Attach current date
      time: new Date().toLocaleTimeString(), // Current time
      status: 'Pending', // Initialize status as "Pending"
    };

    onBookingRequest(bookingDetails); // Pass booking details to App.js
    setShowModal(false);

    // Show notification
    setNotification(`Booking request sent to ${selectedPlumber.name}!`);
    setTimeout(() => setNotification(''), 5000);
  };

  // Handle rating updates
  const handleRating = (plumberId, newRating) => {
    setPlumbers((prevPlumbers) =>
      prevPlumbers.map((plumber) =>
        plumber.id === plumberId
          ? { ...plumber, rating: newRating, ratingCount: plumber.ratingCount + (newRating > plumber.rating ? 1 : -1) }
          : plumber
      )
    );
  };

  // Render star ratings
  const renderStars = (plumber) => {
    const fullStars = Math.floor(plumber.rating);
    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`star ${i < fullStars ? 'filled' : ''}`}
            onClick={() => handleRating(plumber.id, i + 1)} // Update rating dynamically
          >
            ★
          </span>
        ))}
        <span className="rating-count">({plumber.ratingCount} reviews)</span>
      </div>
    );
  };

  return (
    <div className="profession">
      <h2>Plumbers</h2>
      <div className="grid-container">
        {plumbers.map((plumber) => (
          <div className="grid-item" key={plumber.id}>
            <img
              src={plumber.photo || defaultAvatar}
              alt={plumber.name}
              className="plumber-photo"
            />
            <h3>{plumber.name}</h3>
            <p>Experience: {plumber.experience}</p>
            <div className="rating">{renderStars(plumber)}</div>
            <button className="btn book" onClick={() => handleSelect(plumber)}>
              Book Now
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Booking for {selectedPlumber.name}</h3>
            <form className="booking-form" onSubmit={handleBookingRequest}>
              <input name="name" type="text" placeholder="Your Name" required />
              <input name="phone" type="tel" placeholder="Your Phone Number" required />
              <input name="address" type="text" placeholder="Your Address" required />
              <textarea name="jobDetails" placeholder="Job Details" rows="3" required></textarea>
              <button type="submit" className="btn book">Submit Booking</button>
              <button type="button" className="btn cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {notification && (
        <div className="notification">
          <p>{notification}</p>
        </div>
      )}
    </div>
  );
};

export default Plumbers;
