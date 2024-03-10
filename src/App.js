import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Routers from './Routers'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routers/>
      </Router>
    </AuthProvider>
  );
}

export default App;


