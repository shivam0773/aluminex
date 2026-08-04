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
import { createCompany } from '../../services/api';
import CompanyForm from './CompanyForm';

const INITIAL_STATE = {
  name: '',
  industry: '',
  company_type: '',
  website: '',
  gst: '',
  phone: '',
  email: '',
  linkedin: '',
  annual_capacity: '',
  status: 'Lead',
  lead_source: ''
};

export default function AddCompanyDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Company name is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (formData.gst && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst)) {
        // Simple GST validation (India format) - just as an example
        // If users from other countries use it, we might need to adjust or make it optional
        // For now, I'll keep it loose or just check length if not Indian specific
    }

    if (formData.annual_capacity && parseFloat(formData.annual_capacity) < 0) {
      errors.annual_capacity = 'Capacity must be positive';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setError(null);

    try {
      // Trim all strings
      const trimmedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = typeof formData[key] === 'string' ? formData[key].trim() : formData[key];
        return acc;
      }, {});

      const payload = {
        ...trimmedData,
        annual_capacity: trimmedData.annual_capacity ? parseFloat(trimmedData.annual_capacity) : null,
        addresses: [],
        product_interests: []
      };
      
      await createCompany(payload);
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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Company</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <CompanyForm 
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
          {loading ? <CircularProgress size={24} /> : 'Save Company'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
