// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import RegisterPage from './Components/RegisterPage';
import ProfilePage from './Components/ProfilePage';

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage onRegister={setUserId} />} />
        <Route 
          path="/profile" 
          element={userId ? <ProfilePage userId={userId} /> : <p>Please register or log in.</p>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
