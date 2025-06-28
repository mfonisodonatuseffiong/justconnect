import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getPlumbers = async () => {
  const response = await axios.get(`${API_URL}/plumbers`);
  return response.data;
};

export const addBooking = async (bookingData) => {
  const response = await axios.post(`${API_URL}/bookings`, bookingData);
  return response.data;
};
