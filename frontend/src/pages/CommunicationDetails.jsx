import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchCommunication } from '../services/api';

export default function CommunicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comm, setComm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCommunication();
  }, [id]);

  const loadCommunication = async () => {
    setLoading(true);
    try {
      const data = await fetchCommunication(id);
      setComm(data);
    } catch (err) {
      setError(err.message || 'Failed to load communication details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!comm) return <Container sx={{ mt: 4 }}><Typography>Communication not found.</Typography></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/communications')} sx={{ mb: 2 }}>
        Back to Communications
      </Button>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Communication Details</Typography>
        <Stack spacing={2}>
            <Box><Typography variant="subtitle2" color="text.secondary">Date</Typography><Typography>{new Date(comm.date).toLocaleString()}</Typography></Box>
            <Box><Typography variant="subtitle2" color="text.secondary">Channel</Typography><Typography>{comm.channel}</Typography></Box>
            <Box><Typography variant="subtitle2" color="text.secondary">Summary</Typography><Typography>{comm.summary}</Typography></Box>
        </Stack>
      </Paper>
    </Container>
  );
}
