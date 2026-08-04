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
import { updateFollowUp, fetchCompanies } from '../../services/api';
import FollowUpForm from './FollowUpForm';

export default function EditFollowUpDialog({ open, onClose, onSuccess, onError, followUp }) {
  const [formData, setFormData] = useState({});
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (followUp) {
        // Convert ISO date to datetime-local format
        const formattedDate = followUp.scheduled_date ? new Date(followUp.scheduled_date).toISOString().slice(0, 16) : '';
        setFormData({ ...followUp, scheduled_date: formattedDate });
    }
  }, [followUp]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies({ page: 1, size: 100 });
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
    if (!formData.task_description?.trim()) errors.task_description = 'Description is required';
    
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
        company_id: parseInt(formData.company_id),
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        task_description: formData.task_description.trim(),
        status: formData.status
      };
      
      await updateFollowUp(followUp.id, payload);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Follow-Up</DialogTitle>
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
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Follow-Up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
