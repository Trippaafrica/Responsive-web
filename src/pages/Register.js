import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: yup
    .string()
    .required('Phone number is required'),
  role: yup
    .string()
    .required('Role is required'),
  vehicleType: yup
    .string()
    .when('role', {
      is: 'rider',
      then: yup.string().required('Vehicle type is required for riders'),
      otherwise: yup.string().nullable()
    }),
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'customer',
      vehicleType: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        const { success, error } = await register(values);
        
        if (success) {
          navigate('/login');
        } else {
          setError(error || 'Registration failed. Please try again.');
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Registration error:', err);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              margin="normal"
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
            />
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              margin="normal"
            />
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Phone Number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              margin="normal"
            />
            <TextField
              fullWidth
              id="role"
              name="role"
              select
              label="Role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
              margin="normal"
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="rider">Rider</MenuItem>
            </TextField>
            {formik.values.role === 'rider' && (
              <TextField
                fullWidth
                id="vehicleType"
                name="vehicleType"
                select
                label="Vehicle Type"
                value={formik.values.vehicleType}
                onChange={formik.handleChange}
                error={formik.touched.vehicleType && Boolean(formik.errors.vehicleType)}
                helperText={formik.touched.vehicleType && formik.errors.vehicleType}
                margin="normal"
              >
                <MenuItem value="bike">Bike</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
                <MenuItem value="air">Air</MenuItem>
                <MenuItem value="fuel">Fuel</MenuItem>
              </TextField>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            
            <Divider sx={{ my: 2 }}>OR</Divider>
            
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
            >
              Already have an account? Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 