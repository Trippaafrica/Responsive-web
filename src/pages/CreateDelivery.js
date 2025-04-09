import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

const validationSchema = yup.object({
  deliveryType: yup
    .string()
    .required('Delivery type is required'),
  pickupLocation: yup
    .object()
    .shape({
      address: yup.string().required('Pickup location is required'),
      coordinates: yup.object().shape({
        lat: yup.number().required(),
        lng: yup.number().required()
      })
    })
    .required(),
  destination: yup
    .object()
    .shape({
      address: yup.string().required('Destination is required'),
      coordinates: yup.object().shape({
        lat: yup.number().required(),
        lng: yup.number().required()
      })
    })
    .required(),
  packageDetails: yup
    .object()
    .shape({
      weight: yup.number().required('Weight is required'),
      dimensions: yup.object().shape({
        length: yup.number().required('Length is required'),
        width: yup.number().required('Width is required'),
        height: yup.number().required('Height is required')
      }),
      description: yup.string().required('Description is required')
    })
    .required(),
  pickupTime: yup
    .date()
    .required('Pickup time is required'),
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price must be greater than 0')
});

const CreateDelivery = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [pickupMarker, setPickupMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [mapView, setMapView] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 2
  });

  const formik = useFormik({
    initialValues: {
      deliveryType: '',
      pickupLocation: {
        address: '',
        coordinates: { lat: 0, lng: 0 }
      },
      destination: {
        address: '',
        coordinates: { lat: 0, lng: 0 }
      },
      packageDetails: {
        weight: '',
        dimensions: {
          length: '',
          width: '',
          height: ''
        },
        description: ''
      },
      pickupTime: '',
      price: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('/api/deliveries', values);
        navigate('/customer/dashboard');
      } catch (err) {
        console.error('Error creating delivery:', err);
      }
    },
  });

  const handleMapClick = (event) => {
    const { lngLat } = event;
    if (!pickupMarker) {
      setPickupMarker(lngLat);
      formik.setFieldValue('pickupLocation.coordinates', {
        lat: lngLat.lat,
        lng: lngLat.lng
      });
    } else if (!destinationMarker) {
      setDestinationMarker(lngLat);
      formik.setFieldValue('destination.coordinates', {
        lat: lngLat.lat,
        lng: lngLat.lng
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Delivery
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Delivery Type</InputLabel>
                <Select
                  name="deliveryType"
                  value={formik.values.deliveryType}
                  onChange={formik.handleChange}
                  error={formik.touched.deliveryType && Boolean(formik.errors.deliveryType)}
                >
                  <MenuItem value="bike">Bike Delivery</MenuItem>
                  <MenuItem value="truck">Truck Delivery</MenuItem>
                  <MenuItem value="air">Air Cargo</MenuItem>
                  <MenuItem value="fuel">Fuel Delivery</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                name="pickupLocation.address"
                label="Pickup Location"
                value={formik.values.pickupLocation.address}
                onChange={formik.handleChange}
                error={formik.touched.pickupLocation?.address && Boolean(formik.errors.pickupLocation?.address)}
                helperText={formik.touched.pickupLocation?.address && formik.errors.pickupLocation?.address}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                name="destination.address"
                label="Destination"
                value={formik.values.destination.address}
                onChange={formik.handleChange}
                error={formik.touched.destination?.address && Boolean(formik.errors.destination?.address)}
                helperText={formik.touched.destination?.address && formik.errors.destination?.address}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                name="packageDetails.weight"
                label="Package Weight (kg)"
                type="number"
                value={formik.values.packageDetails.weight}
                onChange={formik.handleChange}
                error={formik.touched.packageDetails?.weight && Boolean(formik.errors.packageDetails?.weight)}
                helperText={formik.touched.packageDetails?.weight && formik.errors.packageDetails?.weight}
                sx={{ mb: 3 }}
              />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    name="packageDetails.dimensions.length"
                    label="Length (cm)"
                    type="number"
                    value={formik.values.packageDetails.dimensions.length}
                    onChange={formik.handleChange}
                    error={formik.touched.packageDetails?.dimensions?.length && Boolean(formik.errors.packageDetails?.dimensions?.length)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    name="packageDetails.dimensions.width"
                    label="Width (cm)"
                    type="number"
                    value={formik.values.packageDetails.dimensions.width}
                    onChange={formik.handleChange}
                    error={formik.touched.packageDetails?.dimensions?.width && Boolean(formik.errors.packageDetails?.dimensions?.width)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    name="packageDetails.dimensions.height"
                    label="Height (cm)"
                    type="number"
                    value={formik.values.packageDetails.dimensions.height}
                    onChange={formik.handleChange}
                    error={formik.touched.packageDetails?.dimensions?.height && Boolean(formik.errors.packageDetails?.dimensions?.height)}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                name="packageDetails.description"
                label="Package Description"
                multiline
                rows={3}
                value={formik.values.packageDetails.description}
                onChange={formik.handleChange}
                error={formik.touched.packageDetails?.description && Boolean(formik.errors.packageDetails?.description)}
                helperText={formik.touched.packageDetails?.description && formik.errors.packageDetails?.description}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                name="pickupTime"
                label="Pickup Time"
                type="datetime-local"
                value={formik.values.pickupTime}
                onChange={formik.handleChange}
                error={formik.touched.pickupTime && Boolean(formik.errors.pickupTime)}
                helperText={formik.touched.pickupTime && formik.errors.pickupTime}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                name="price"
                label="Price ($)"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Create Delivery
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Select Locations on Map
              </Typography>
              <Box sx={{ height: 500, width: '100%' }}>
                <Map
                  initialViewState={mapView}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                  onClick={handleMapClick}
                >
                  <NavigationControl />
                  {pickupMarker && (
                    <Marker
                      longitude={pickupMarker.lng}
                      latitude={pickupMarker.lat}
                      color="red"
                    />
                  )}
                  {destinationMarker && (
                    <Marker
                      longitude={destinationMarker.lng}
                      latitude={destinationMarker.lat}
                      color="blue"
                    />
                  )}
                </Map>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateDelivery; 