import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider
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
  vehicle_type: yup
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

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'customer', // Default to customer
      vehicle_type: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { success, error } = await register(values);
      if (success) {
        navigate('/login');
      } else {
        console.error(error);
      }
    },
  });

  const handleSignUpAsRider = () => {
    formik.setFieldValue('role', 'rider');
    // You can add additional validation or open a dialog for vehicle type here
  };

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
            Register
          </Typography>

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
            
            {formik.values.role === 'rider' && (
              <TextField
                fullWidth
                id="vehicle_type"
                name="vehicle_type"
                label="Vehicle Type"
                value={formik.values.vehicle_type}
                onChange={formik.handleChange}
                error={formik.touched.vehicle_type && Boolean(formik.errors.vehicle_type)}
                helperText={formik.touched.vehicle_type && formik.errors.vehicle_type}
                margin="normal"
              />
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {formik.values.role === 'rider' ? 'Sign Up as Rider' : 'Sign Up as Customer'}
            </Button>
            
            <Divider sx={{ my: 2 }}>OR</Divider>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={handleSignUpAsRider}
                  sx={{ mb: 2 }}
                >
                  {formik.values.role === 'rider' ? 'Switch to Customer Signup' : 'Switch to Rider Signup'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Sign In
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="text"
                  color="secondary"
                  onClick={() => {
                    localStorage.setItem('preferredRole', 'rider');
                    navigate('/login');
                  }}
                >
                  Login as a Rider
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 