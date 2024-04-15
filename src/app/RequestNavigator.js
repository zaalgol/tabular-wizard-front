// a component wrapper around makeRequest function, to allow it use navigation to login if needed.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../api';

const RequestNavigator = () => {
  const navigate = useNavigate();

  const handleMakeRequest = async (...args) => {
    try {
      await makeRequest(...args);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login', { replace: true });
      }
    }
  };

  return null;
};

export default RequestNavigator;