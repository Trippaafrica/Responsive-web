import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { supabase } from '../lib/supabase';

const DeliveryDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [delivery, setDelivery] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const { data, error } = await supabase
          .from('deliveries')
          .select(`
            *,
            bids (
              id,
              amount,
              status,
              estimated_time,
              message,
              rider:rider_id (
                id,
                name,
                phone,
                vehicle_type
              )
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setDelivery(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!delivery) {
    return (
      <Container>
        <Typography>Delivery not found</Typography>
      </Container>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
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
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Delivery Details
          </Typography>
          <Chip
            label={delivery.status.replace('_', ' ')}
            color={getStatusColor(delivery.status)}
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Pickup Information
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Address:</strong> {delivery.pickup_location.address}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Time:</strong> {new Date(delivery.pickup_time).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Destination Information
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Address:</strong> {delivery.destination.address}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Package Details
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Type:</strong> {delivery.delivery_type}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Weight:</strong> {delivery.package_details.weight} kg
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Dimensions:</strong> {delivery.package_details.dimensions.length} x{' '}
              {delivery.package_details.dimensions.width} x{' '}
              {delivery.package_details.dimensions.height} cm
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Description:</strong> {delivery.package_details.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Price:</strong> ${delivery.price}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Payment Status:</strong> {delivery.payment_status}
            </Typography>
          </Grid>

          {delivery.bids && delivery.bids.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Bids
                </Typography>
                {delivery.bids.map((bid) => (
                  <Paper key={bid.id} sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle1">
                          <strong>Amount:</strong> ${bid.amount}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Estimated Time:</strong> {bid.estimated_time} minutes
                        </Typography>
                        {bid.message && (
                          <Typography variant="body2">
                            <strong>Message:</strong> {bid.message}
                          </Typography>
                        )}
                        {bid.rider && (
                          <Typography variant="body2">
                            <strong>Rider:</strong> {bid.rider.name} ({bid.rider.vehicle_type})
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={bid.status}
                        color={bid.status === 'accepted' ? 'success' : 'default'}
                      />
                    </Box>
                  </Paper>
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default DeliveryDetails; 