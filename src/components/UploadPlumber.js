import React, { useState } from 'react';
import './UploadPlumber.css';

const UploadPlumber = ({ addPlumber }) => {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('');
  const [contact, setContact] = useState('');
  const [photo, setPhoto] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !experience || !contact || !photo || !rating) {
      alert('Please fill in all fields');
      return;
    }
    const newPlumber = { name, experience, contact, photo, rating };
    addPlumber(newPlumber);

    // Clear the form
    setName('');
    setExperience('');
    setContact('');
    setPhoto('');
    setRating('');
  };

  return (
    <div className="upload-plumber">
      <h3>Add a New Plumber</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button type="submit">Add Plumber</button>
      </form>
    </div>
  );
};

export default UploadPlumber;
