import React, { useState, useEffect } from 'react';
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
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  AttachMoney
} from '@mui/icons-material';
import axios from 'axios';

const RiderDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAvailableDeliveries();
    fetchMyBids();
  }, []);

  const fetchAvailableDeliveries = async () => {
    try {
      const res = await axios.get('/api/deliveries/available');
      setDeliveries(res.data);
    } catch (err) {
      console.error('Error fetching available deliveries:', err);
    }
  };

  const fetchMyBids = async () => {
    try {
      const res = await axios.get('/api/bids/my-bids');
      setBids(res.data);
    } catch (err) {
      console.error('Error fetching my bids:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    try {
      await axios.post('/api/bids', {
        delivery: selectedDelivery._id,
        amount: parseFloat(bidAmount),
        estimatedTime: parseInt(estimatedTime),
        message
      });
      setOpenDialog(false);
      fetchAvailableDeliveries();
      fetchMyBids();
    } catch (err) {
      console.error('Error placing bid:', err);
    }
  };

  const handleViewDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    setOpenDialog(true);
  };

  const getBidStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Deliveries
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
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
                      label={`$${delivery.price}`}
                      color="primary"
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
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleViewDelivery(delivery)}>
                    Place Bid
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Typography variant="h4" component="h1" sx={{ mt: 4, mb: 2 }}>
        My Bids
      </Typography>

      <Grid container spacing={3}>
        {bids.map((bid) => (
          <Grid item xs={12} sm={6} md={4} key={bid._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    Bid #{bid._id.slice(-4)}
                  </Typography>
                  <Chip
                    label={bid.status}
                    color={getBidStatusColor(bid.status)}
                    size="small"
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoney color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Amount: ${bid.amount}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Estimated Time: {bid.estimatedTime} minutes
                  </Typography>
                </Box>

                {bid.message && (
                  <Typography variant="body2" color="text.secondary">
                    Message: {bid.message}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedDelivery && (
          <>
            <DialogTitle>Place Bid</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Delivery Details
                </Typography>
                <Typography variant="body2">
                  From: {selectedDelivery.pickupLocation.address}
                </Typography>
                <Typography variant="body2">
                  To: {selectedDelivery.destination.address}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Bid Amount ($)"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Estimated Time (minutes)"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Message (optional)"
                multiline
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handlePlaceBid}
                disabled={!bidAmount || !estimatedTime}
              >
                Place Bid
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default RiderDashboard; 