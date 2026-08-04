import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  Stack,
  Button,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCommunications, deleteCommunication, fetchCompanies } from '../services/api';
import AddCommunicationDialog from '../components/communication/AddCommunicationDialog';
import EditCommunicationDialog from '../components/communication/EditCommunicationDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Communications() {
  const [communications, setCommunications] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [channel, setChannel] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedComm, setSelectedComm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const companyMap = useMemo(() => {
    return companies.reduce((map, c) => {
      map[c.id] = c.name;
      return map;
    }, {});
  }, [companies]);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadCommunications();
  }, [page, search, companyId, channel]);

  const loadInitialData = async () => {
    try {
      const compData = await fetchCompanies({ page: 1, size: 100 });
      setCompanies(compData.items);
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  const loadCommunications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCommunications({ 
        page, size, search, company_id: companyId, channel 
      });
      setCommunications(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load communications');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setSnackbar({ open: true, message: 'Communication logged successfully!', severity: 'success' });
    loadCommunications();
  };

  const handleEditClick = (e, comm) => {
    e.stopPropagation();
    setSelectedComm(comm);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setSnackbar({ open: true, message: 'Communication updated successfully!', severity: 'success' });
    loadCommunications();
  };

  const handleDeleteClick = (e, comm) => {
    e.stopPropagation();
    setSelectedComm(comm);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCommunication(selectedComm.id);
      setSnackbar({ open: true, message: 'Communication deleted successfully!', severity: 'success' });
      loadCommunications();
      setDeleteDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          Communication History
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setAddDialogOpen(true)}
        >
          Log Communication
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Summary"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Company</InputLabel>
              <Select
                value={companyId}
                label="Company"
                onChange={(e) => { setCompanyId(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Companies</MenuItem>
                {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Channel</InputLabel>
              <Select
                value={channel}
                label="Channel"
                onChange={(e) => { setChannel(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Channels</MenuItem>
                {['Email', 'WhatsApp', 'Call', 'Meeting'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ position: 'relative', minHeight: '200px' }}>
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Channel</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Summary</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {communications.length > 0 ? (
              communications.map((comm) => (
                <TableRow 
                  key={comm.id} 
                  hover 
                  onClick={() => navigate(`/communications/${comm.id}`)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{companyMap[comm.company_id] || 'Unknown'}</TableCell>
                  <TableCell>{new Date(comm.date).toLocaleString()}</TableCell>
                  <TableCell>{comm.channel}</TableCell>
                  <TableCell>{comm.summary}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={(e) => handleEditClick(e, comm)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(e, comm)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No communications found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
        <Pagination 
          count={Math.ceil(total / size)} 
          page={page} 
          onChange={(e, v) => setPage(v)} 
          color="primary" 
        />
      </Stack>

      <AddCommunicationDialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)} 
        onSuccess={handleAddSuccess}
      />

      <EditCommunicationDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        onSuccess={handleEditSuccess}
        commId={selectedComm?.id}
      />

      <ConfirmDialog 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Communication"
        message="Are you sure you want to delete this communication record?"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
