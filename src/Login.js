import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // useNavigate hook for redirecting

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to the main page if authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/login/',
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsAuthenticated(true); // Update authentication state
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/'); // Redirect to the main page
      }
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
