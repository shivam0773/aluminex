import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { updateProduct, fetchProduct } from '../../services/api';
import ProductForm from './ProductForm';

export default function EditProductDialog({ open, onClose, onSuccess, productId }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const prod = await fetchProduct(productId);
        setFormData(prod);
      } catch (err) {
        console.error("Failed to load product", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (open && productId) loadData();
  }, [open, productId]);

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
      
      await updateProduct(productId, payload);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(null);
    setFieldErrors({});
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent dividers>
        {loading && <CircularProgress />}
        {!loading && formData && (
            <>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <ProductForm 
                    initialData={formData} 
                    onChange={setFormData} 
                    errors={fieldErrors} 
                />
            </>
        )}
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
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
