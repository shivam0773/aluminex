import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Button, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { fetchFollowUp } from '../services/api';

export default function FollowUpDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [followUp, setFollowUp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchFollowUp(id);
      setFollowUp(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!followUp) return <Alert severity="warning" sx={{ mt: 4 }}>Follow-up not found</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/followups')} sx={{ mb: 2 }}>Back to Follow-ups</Button>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>Follow-up Task</Typography>
        <Typography color="textSecondary">
          {new Date(followUp.scheduled_date).toLocaleString()} • 
          <Chip 
              label={followUp.status} 
              size="small" 
              sx={{ ml: 1 }}
              color={followUp.status === 'Completed' ? 'success' : followUp.status === 'Cancelled' ? 'error' : 'primary'} 
              variant="outlined"
          />
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}><strong>Description:</strong></Typography>
          <Typography variant="body1">{followUp.task_description}</Typography>
      </Paper>
    </Container>
  );
}
