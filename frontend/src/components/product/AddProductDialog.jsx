import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { createProduct } from '../../services/api';
import ProductForm from './ProductForm';

const INITIAL_STATE = {
  code: '',
  name: '',
  category: '',
  price: '',
  description: '',
  is_active: true
};

export default function AddProductDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = 'Product Code is required';
    if (!formData.name.trim()) errors.name = 'Product Name is required';
    if (!formData.price) errors.price = 'Price is required';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        code: formData.code.trim(),
        name: formData.name.trim()
      };
      
      await createProduct(payload);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_STATE);
    setFieldErrors({});
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <ProductForm 
          initialData={formData} 
          onChange={setFormData} 
          errors={fieldErrors} 
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
