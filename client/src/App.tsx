import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your page components
import Home from './pages/Home';
import LoginPage from './pages/Login';
import Leaderboard from './pages/Leaderboard';
import Search from './pages/Search';
import User from './pages/User';
import Restaurant from './pages/Restaurant';

// Authentication Context Setup
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    // Call your API to invalidate the session
    axios.post('/api/logout').then(() => {
      console.log("Logged out successfully.");
    });
  };

  const checkSession = async () => {
    try {
      const response = await axios.get('/api/session');
      setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
    }
  };

  // Check session on component mount
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

// App Component with Routes
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<ProtectedRoute element={<Leaderboard />} />} />
          <Route path="/restaurant" element={<ProtectedRoute element={<Restaurant />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<User />} />} />
          <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
          {/* Define more routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;