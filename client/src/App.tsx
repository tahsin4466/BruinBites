import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from "./pages/Login";
import Leaderboard from './pages/Leaderboard'; // Adjust the path based on the actual location of your 'Leaderboard' component
import Search from './pages/Search'; // Adjust the path based on the actual location of your 'Leaderboard' component
import User from './pages/User'; // Adjust the path based on the actual location of your 'Leaderboard' component
import Restaurant from './pages/Restaurant';

interface ApiResponse {
  message: string;
}

function App() {
  const [data, setData] = useState<ApiResponse | null>(null); // Specify ApiResponse as the type

  useEffect(() => {
    // Fetch data from Flask API when the component mounts
    axios.get('/api/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSubmit = () => {
    // Example of submitting data to Flask API
    const formData = { key: 'value' }; // Your form data
    axios.post('/api/submit', formData)
      .then(response => {
        console.log('Data submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting data:', error);
      });
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/profile" element={<User />} />



      </Routes>
    </Router>
  );
}

export default App;
        
/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';
=======
import React from 'react';
import Home from './pages/Restaurant';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from Flask API when the component mounts
    axios.get('/api/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSubmit = () => {
    // Example of submitting data to Flask API
    const formData = { key: 'value' }; // Your form data
    axios.post('/api/submit', formData)
      .then(response => {
        console.log('Data submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting data:', error);
      });
  };

  return (
    <div>
      {data ? (
        <p>{data.message}</p>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleSubmit}>Submit Data</button>
    </div>
  );
}

export default App;

 */