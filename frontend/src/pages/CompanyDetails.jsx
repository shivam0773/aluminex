import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Tabs, Tab, CircularProgress, Alert, Paper, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { fetchCompanyById } from '../services/api';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    setLoading(true);
    try {
      const data = await fetchCompanyById(id);
      setCompany(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>{company.name}</Typography>
        <Typography color="textSecondary">{company.industry} • {company.status}</Typography>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" />
          <Tab label="Contacts" />
          <Tab label="Addresses" />
          <Tab label="Products" />
          <Tab label="Notes" />
          <Tab label="History" />
          <Tab label="Follow Ups" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1"><strong>Industry:</strong> {company.industry}</Typography>
            <Typography variant="subtitle1"><strong>Type:</strong> {company.company_type}</Typography>
            <Typography variant="subtitle1"><strong>Website:</strong> {company.website}</Typography>
            <Typography variant="subtitle1"><strong>Annual Capacity:</strong> {company.annual_capacity} tons</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1"><strong>Email:</strong> {company.email}</Typography>
            <Typography variant="subtitle1"><strong>Phone:</strong> {company.phone}</Typography>
            <Typography variant="subtitle1"><strong>GST:</strong> {company.gst}</Typography>
            <Typography variant="subtitle1"><strong>Lead Source:</strong> {company.lead_source}</Typography>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}><Typography>Contacts List (To be implemented)</Typography></TabPanel>
      <TabPanel value={tabValue} index={2}><Typography>Addresses List (To be implemented)</Typography></TabPanel>
      <TabPanel value={tabValue} index={3}><Typography>Products List (To be implemented)</Typography></TabPanel>
      <TabPanel value={tabValue} index={4}><Typography>Notes Timeline (To be implemented)</Typography></TabPanel>
      <TabPanel value={tabValue} index={5}><Typography>Communication History (To be implemented)</Typography></TabPanel>
      <TabPanel value={tabValue} index={6}><Typography>Follow Ups List (To be implemented)</Typography></TabPanel>
    </Container>
  );
}
