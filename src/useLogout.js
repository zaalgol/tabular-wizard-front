// src/useLogout.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const useLogout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return logout;
};

export default useLogout;
