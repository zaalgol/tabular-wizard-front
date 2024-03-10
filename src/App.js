import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Routers from './Routers'
import Header from './Header';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routers/>
      </Router>
    </AuthProvider>
  );
}

export default App;


