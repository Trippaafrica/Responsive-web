import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import RiderDashboard from './pages/RiderDashboard';
import CreateDelivery from './pages/CreateDelivery';
import DeliveryDetails from './pages/DeliveryDetails';
import Profile from './pages/Profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/customer/dashboard"
              element={
                <PrivateRoute role="customer">
                  <CustomerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/rider/dashboard"
              element={
                <PrivateRoute role="rider">
                  <RiderDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/deliveries/create"
              element={
                <PrivateRoute role="customer">
                  <CreateDelivery />
                </PrivateRoute>
              }
            />
            <Route
              path="/deliveries/:id"
              element={
                <PrivateRoute roles={['customer', 'rider']}>
                  <DeliveryDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute roles={['customer', 'rider']}>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
