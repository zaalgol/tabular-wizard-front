import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { useWebSocket } from "../app/WebSocketContext";

const useLogout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const { setToken } = useWebSocket();

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null); // inform WebSocketContext we have no token
    setIsAuthenticated(false);
    navigate('/login');
  };

  return logout;
};

export default useLogout;
