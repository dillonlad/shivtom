import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'; // Added useLocation
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import Home from './pages/Home';
import Landing from './pages/Landing';

Amplify.configure(awsExports);

function App() {
  const location = useLocation();

  // Define your different backgrounds
  const backgrounds = {
    '/landing': {
      backgroundImage: 'none', // Remove the fuji image
      backgroundColor: '#f0d1e5' // The specific color you wanted
    }
  };

  // Get current style based on path, default to fuji-pink if route isn't found
  const currentBackground = backgrounds[location.pathname] || backgrounds['/'];

  const dynamicStyle = {
    maxWidth: '100vw',
    minHeight: '100vh',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transition: 'all 0.5s ease', // Optional: makes the color/image swap smooth
    ...currentBackground
  };

  return (
    <div className="d-flex">
      <div className="content p-5 w-100" style={dynamicStyle}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;