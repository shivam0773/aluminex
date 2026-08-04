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
import { updateCompany } from '../../services/api';
import CompanyForm from './CompanyForm';

export default function EditCompanyDialog({ open, onClose, onSuccess, company }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData(company);
    }
  }, [company]);

  const validate = () => {
    const errors = {};
    if (!formData.name || !formData.name.trim()) errors.name = 'Company name is required';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
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
      // Trim all strings and extract only core fields
      const coreFields = [
        'name', 'industry', 'company_type', 'website', 
        'gst', 'phone', 'email', 'linkedin', 
        'annual_capacity', 'status', 'lead_source'
      ];

      const payload = coreFields.reduce((acc, key) => {
        const val = formData[key];
        acc[key] = typeof val === 'string' ? val.trim() : val;
        return acc;
      }, {});

      if (payload.annual_capacity !== undefined) {
        payload.annual_capacity = payload.annual_capacity ? parseFloat(payload.annual_capacity) : null;
      }
      
      await updateCompany(company.id, payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Company: {company?.name}</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <CompanyForm 
          initialData={formData} 
          onChange={setFormData} 
          errors={fieldErrors} 
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Company'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
