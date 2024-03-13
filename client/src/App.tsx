// App.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';

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
  isLoading: boolean; // Add this line
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
  navigate: any; // Using any for simplicity, consider specifying a more precise type
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children, navigate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = () => {
    setIsAuthenticated(true);
    navigate('/'); // Navigate to the home page upon login
  };
  const logout = () => {
    setIsAuthenticated(false);
    axios.post('/api/logout').then(() => {
      console.log("Logged out successfully.");
      navigate('/login'); // Optionally navigate to login page upon logout
    });
  };

  const checkSession = async () => {
    setIsLoading(true);
    try {
        const response = await axios.get('/api/session');
        setIsAuthenticated(response.data.isAuthenticated);
    } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
    }
    setIsLoading(false);
};

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth(); // Destructure isLoading here

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message or spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

// Component that encapsulates the use of useNavigate and AuthProvider
const AppWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <AuthProvider navigate={navigate}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<ProtectedRoute element={<Leaderboard />} />} />
        <Route path="/restaurant/:name" element={<ProtectedRoute element={<Restaurant />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<User />} />} />
        <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
        {/* Define more routes as needed */}
      </Routes>
    </AuthProvider>
  );
};

// Main App Component with Router
const App: React.FC = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;