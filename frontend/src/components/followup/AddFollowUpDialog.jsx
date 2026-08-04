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
import { createFollowUp, fetchCompanies } from '../../services/api';
import FollowUpForm from './FollowUpForm';

const INITIAL_STATE = {
  company_id: '',
  scheduled_date: '',
  task_description: '',
  status: 'Pending'
};

export default function AddFollowUpDialog({ open, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies({ page: 1, size: 1000 });
        setCompanies(data.items);
      } catch (err) {
        console.error("Failed to load companies", err);
      }
    };
    if (open) loadCompanies();
  }, [open]);

  const validate = () => {
    const errors = {};
    if (!formData.company_id) errors.company_id = 'Company is required';
    if (!formData.scheduled_date) errors.scheduled_date = 'Date is required';
    if (!formData.task_description.trim()) errors.task_description = 'Description is required';
    
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
        company_id: parseInt(formData.company_id),
        task_description: formData.task_description.trim()
      };
      
      await createFollowUp(payload);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
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
      <DialogTitle>Add New Follow-Up</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <FollowUpForm 
          initialData={formData} 
          onChange={setFormData} 
          errors={fieldErrors} 
          companies={companies}
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
          {loading ? <CircularProgress size={24} /> : 'Save Follow-Up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
