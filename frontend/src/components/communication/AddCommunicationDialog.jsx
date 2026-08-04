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
import { createCommunication, fetchCompanies, fetchContacts } from '../../services/api';
import CommunicationForm from './CommunicationForm';

const INITIAL_STATE = {
  company_id: '',
  contact_person_id: '',
  channel: 'Email',
  summary: '',
  date: new Date().toISOString().slice(0, 16)
};

export default function AddCommunicationDialog({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cData, contData] = await Promise.all([
            fetchCompanies({ page: 1, size: 100 }),
            fetchContacts({ page: 1, size: 100 })
        ]);
        setCompanies(cData.items);
        setContacts(contData.items);
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load companies or contacts");
      }
    };
    if (open) loadData();
  }, [open]);

  const validate = () => {
    const errors = {};
    if (!formData.company_id) errors.company_id = 'Company is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.summary.trim()) errors.summary = 'Summary is required';
    
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
        contact_person_id: formData.contact_person_id ? parseInt(formData.contact_person_id) : null,
        summary: formData.summary.trim()
      };
      
      await createCommunication(payload);
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
      <DialogTitle>Log New Communication</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <CommunicationForm 
          initialData={formData} 
          onChange={setFormData} 
          errors={fieldErrors} 
          companies={companies}
          contacts={contacts}
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
          {loading ? <CircularProgress size={24} /> : 'Save Log'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
