import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchProduct } from '../services/api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await fetchProduct(id);
      setProduct(data);
    } catch (err) {
      setError(err.message || 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!product) return <Container sx={{ mt: 4 }}><Typography>Product not found.</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')} sx={{ mb: 2 }}>
        Back to Products
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Product Details</Typography>
        <Stack spacing={2}>
            <Box><Typography variant="subtitle2" color="text.secondary">Code</Typography><Typography>{product.code}</Typography></Box>
            <Box><Typography variant="subtitle2" color="text.secondary">Name</Typography><Typography>{product.name}</Typography></Box>
            <Box><Typography variant="subtitle2" color="text.secondary">Category</Typography><Typography>{product.category}</Typography></Box>
            <Box><Typography variant="subtitle2" color="text.secondary">Price</Typography><Typography>{product.price}</Typography></Box>
            <Box>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip label={product.is_active ? 'Active' : 'Inactive'} color={product.is_active ? 'success' : 'default'} />
            </Box>
            <Box><Typography variant="subtitle2" color="text.secondary">Description</Typography><Typography>{product.description || 'N/A'}</Typography></Box>
        </Stack>
      </Paper>
    </Container>
  );
}
