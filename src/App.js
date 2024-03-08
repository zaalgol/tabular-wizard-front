import React from 'react';
import { AuthProvider } from './AuthContext';
import Login from './Login';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Login />
      </div>
    </AuthProvider>
  );
}

export default App;;
