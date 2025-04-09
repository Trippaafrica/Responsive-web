import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn,
  AccessTime,
  LocalShipping
} from '@mui/icons-material';
import axios from 'axios';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get('/api/deliveries/my-deliveries');
      setDeliveries(res.data);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDelivery = () => {
    navigate('/delivery/create');
  };

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          My Deliveries
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateDelivery}
        >
          New Delivery
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : deliveries.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No deliveries yet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateDelivery}
          >
            Create Your First Delivery
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {deliveries.map((delivery) => (
            <Grid item xs={12} sm={6} md={4} key={delivery._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {delivery.deliveryType.charAt(0).toUpperCase() + delivery.deliveryType.slice(1)} Delivery
                    </Typography>
                    <Chip
                      label={delivery.status}
                      color={getStatusColor(delivery.status)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {delivery.pickupLocation.address}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {delivery.destination.address}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(delivery.pickupTime).toLocaleString()}
                    </Typography>
                  </Box>

                  {delivery.acceptedBid && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalShipping color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Accepted Bid: ${delivery.acceptedBid.amount}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleViewDelivery(delivery)}>
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDelivery && (
          <>
            <DialogTitle>Delivery Details</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Status: <Chip label={selectedDelivery.status} color={getStatusColor(selectedDelivery.status)} />
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Pickup Location
                </Typography>
                <Typography variant="body2">
                  {selectedDelivery.pickupLocation.address}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Destination
                </Typography>
                <Typography variant="body2">
                  {selectedDelivery.destination.address}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Package Details
                </Typography>
                <Typography variant="body2">
                  {selectedDelivery.packageDetails.description}
                </Typography>
              </Box>

              {selectedDelivery.acceptedBid && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Accepted Bid
                  </Typography>
                  <Typography variant="body2">
                    Amount: ${selectedDelivery.acceptedBid.amount}
                  </Typography>
                  <Typography variant="body2">
                    Estimated Time: {selectedDelivery.acceptedBid.estimatedTime} minutes
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default CustomerDashboard; 