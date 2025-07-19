import React, { useState, useContext } from 'react';
import './Profession.css';
import profile from '../assets/profile.jpg';
import defaultAvatar from '../assets/default-avatar.png';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Plumbers = () => {
  const [plumbers] = useState([
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSelect = (plumber) => {
    if (!user) {
      alert('You must be logged in to book a professional.');
      navigate('/login');
      return;
    }
    setSelectedPlumber(plumber);
    setShowModal(true);
  };

  const handleBookingRequest = async (event) => {
    event.preventDefault();

    const bookingDetails = {
      user_id: user.id,
      user_name: user.name,
      contact: event.target.phone.value,
      address: event.target.address.value,
      jobDetails: event.target.jobDetails.value,
      professional_id: selectedPlumber.id,
      professional: selectedPlumber.name,
      professionalContact: selectedPlumber.contact,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    try {
      await axios.post("http://localhost:5000/api/bookings", bookingDetails, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setNotification(`Booking request sent to ${selectedPlumber.name}!`);
      setShowModal(false);
      setTimeout(() => setNotification(''), 5000);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to send booking. Please try again.');
    }
  };

  const handleRating = (plumberId, newRating) => {
    // Optional: Local rating update logic
  };

  const renderStars = (plumber) => {
    const fullStars = Math.floor(plumber.rating);
    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`star ${i < fullStars ? 'filled' : ''}`}
            onClick={() => handleRating(plumber.id, i + 1)}
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

      {showModal && selectedPlumber && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Booking for {selectedPlumber.name}</h3>
            <form className="booking-form" onSubmit={handleBookingRequest}>
              <input
                name="name"
                type="text"
                value={user?.name}
                readOnly
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Your Phone Number"
                required
              />
              <input
                name="address"
                type="text"
                placeholder="Your Address"
                required
              />
              <textarea
                name="jobDetails"
                placeholder="Job Details"
                rows="3"
                required
              ></textarea>
              <button type="submit" className="btn book">
                Submit Booking
              </button>
              <button
                type="button"
                className="btn cancel"
                onClick={() => setShowModal(false)}
              >
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
