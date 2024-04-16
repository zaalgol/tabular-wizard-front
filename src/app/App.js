import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../authentication/AuthContext';
import Routers from '../app/Routers';
import Header from './Header';
import { WebSocketProvider } from './WebSocketContext';
import Notifications from './Notifications';
// import RequestNavigator from './RequestNavigator';

function App() {
  return (
    <WebSocketProvider>
      <AuthProvider>
        <Router>
          <Header />
          <Notifications />
          <Routers />
          {/* <RequestNavigator /> */}
        </Router>
      </AuthProvider>
    </WebSocketProvider>
  );
}

export default App;
