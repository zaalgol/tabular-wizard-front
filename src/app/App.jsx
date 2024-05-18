import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../authentication/AuthContext';
import Routers from '../app/Routers';
import Header from './Header';
import Sidebar from './Sidebar';
import { WebSocketProvider } from './WebSocketContext';
import Notifications from './Notifications';
import './App.css'; 

function App() {
  return (
    <WebSocketProvider>
      <AuthProvider>
        <Router>
          <Header />
          <Sidebar />
          <div className="main-content">
            <Notifications />
            <Routers /> 
          </div>
        </Router>
      </AuthProvider>
    </WebSocketProvider>
  );
}

export default App;
