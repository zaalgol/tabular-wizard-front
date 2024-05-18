// src/app/RequestNavigator.js
import makeRequest from './api';

const handleMakeRequest = async (navigate, ...args) => {
  try {
    return await makeRequest(...args);
  } catch (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 422)) {
      navigate('/login', { replace: true });
    } else {
      throw error;
    }
  }
};

export { handleMakeRequest };