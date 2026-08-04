import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Alert } from '@mui/material';
import { updateContact } from '../../services/api';
import ContactForm from './ContactForm';

export default function EditContactDialog({ open, onClose, onSuccess, contact, companies }) {
  const [formData, setFormData] = useState(contact || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.company_id) errors.company_id = 'Company is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      await updateContact(contact.id, formData);
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
      <DialogTitle>Edit Contact</DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <ContactForm initialData={contact} onChange={setFormData} errors={fieldErrors} companies={companies} />
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Update'}</Button>
      </DialogActions>
    </Dialog>
  );
}
