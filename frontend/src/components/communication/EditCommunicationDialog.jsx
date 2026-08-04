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
import { updateCommunication, fetchCommunication, fetchCompanies, fetchContacts } from '../../services/api';
import CommunicationForm from './CommunicationForm';

export default function EditCommunicationDialog({ open, onClose, onSuccess, commId }) {
  const [formData, setFormData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cData, contData, comm] = await Promise.all([
          fetchCompanies({ page: 1, size: 100 }),
          fetchContacts({ page: 1, size: 100 }),
          fetchCommunication(commId)
        ]);
        setCompanies(cData.items);
        setContacts(contData.items);
        setFormData({
            ...comm,
            date: comm.date.slice(0, 16)
        });
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    if (open && commId) loadData();
  }, [open, commId]);

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
      
      await updateCommunication(commId, payload);
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
      <DialogTitle>Edit Communication Log</DialogTitle>
      <DialogContent dividers>
        {loading && <CircularProgress />}
        {!loading && formData && (
            <>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <CommunicationForm 
                    initialData={formData} 
                    onChange={setFormData} 
                    errors={fieldErrors} 
                    companies={companies}
                    contacts={contacts}
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
