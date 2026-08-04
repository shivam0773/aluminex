import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Grid, Button, Divider } from '@mui/material';
import { fetchContact, fetchCompanies } from '../services/api';

export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const contactData = await fetchContact(id);
      setContact(contactData);
      // Fetch company name
      const companyData = await fetchCompanies({ page: 1, size: 100 });
      setCompany(companyData.items.find(c => c.id === contactData.company_id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/contacts')} sx={{ mb: 2 }}>&larr; Back to Contacts</Button>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>{contact.name}</Typography>
        <Typography variant="h6" color="primary" gutterBottom>{company?.name || 'No Company'}</Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography><strong>Designation:</strong> {contact.designation || '-'}</Typography>
            <Typography><strong>Email:</strong> {contact.email || '-'}</Typography>
            <Typography><strong>Phone:</strong> {contact.phone || '-'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography><strong>WhatsApp:</strong> {contact.whatsapp || '-'}</Typography>
            <Typography><strong>LinkedIn:</strong> {contact.linkedin || '-'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
