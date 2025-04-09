import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  Grid
} from '@mui/material';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    vehicleType: user?.vehicle_type || '',
    role: user?.role || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{ width: 100, height: 100, mb: 2 }}
            alt={formData.name}
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Profile Settings
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>

            {formData.role === 'rider' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Vehicle Type"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="bike">Bike</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile; 