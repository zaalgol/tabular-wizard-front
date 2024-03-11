import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../authentication/AuthContext';
import Routers from '../app/Routers'
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


