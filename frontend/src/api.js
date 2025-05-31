import axios from 'axios';

// Get the API base URL from your .env file
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Create an axios instance with the baseURL
const API = axios.create({
  baseURL: API_BASE_URL,
  // You can add other default configs here if needed
  // headers: { 'Content-Type': 'application/json' },
});

export default API;
