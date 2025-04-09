import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme
} from '@mui/material';

const DeliveryDetails = ({ delivery, open, onClose }) => {
  const theme = useTheme();

  if (!delivery) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Delivery Details</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Status: {delivery.status}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Pickup Address: {delivery.pickupAddress}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Destination Address: {delivery.destinationAddress}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Package Details: {delivery.packageDetails}
          </Typography>
          {delivery.acceptedBid && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Accepted Bid Amount: ${delivery.acceptedBid.amount}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Estimated Time: {delivery.acceptedBid.estimatedTime} minutes
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryDetails; 