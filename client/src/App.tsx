import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from "./pages/Login";
import Leaderboard from './pages/Leaderboard'; // Adjust the path based on the actual location of your 'Leaderboard' component
import Search from './pages/Search'; // Adjust the path based on the actual location of your 'Leaderboard' component
import User from './pages/User'; // Adjust the path based on the actual location of your 'Leaderboard' component
import Restaurant from './pages/Restaurant';

function App() {
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