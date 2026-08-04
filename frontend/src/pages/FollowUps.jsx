import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  Button,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchFollowUps, deleteFollowUp, fetchCompanies } from '../services/api';
import AddFollowUpDialog from '../components/followup/AddFollowUpDialog';
import EditFollowUpDialog from '../components/followup/EditFollowUpDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function FollowUps() {
  const navigate = useNavigate();
  const [followUps, setFollowUps] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [status, setStatus] = useState('');
  const [scheduledAfter, setScheduledAfter] = useState('');
  const [scheduledBefore, setScheduledBefore] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
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
    loadFollowUps();
  }, [page, search, companyId, status, scheduledAfter, scheduledBefore]);

  const loadInitialData = async () => {
    try {
      const compData = await fetchCompanies({ page: 1, size: 100 });
      setCompanies(compData.items);
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  const loadFollowUps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFollowUps({ 
        page, size, search, company_id: companyId, status, 
        scheduled_after: scheduledAfter, scheduled_before: scheduledBefore 
      });
      setFollowUps(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load follow-ups');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setSnackbar({ open: true, message: 'Follow-up created successfully!', severity: 'success' });
    loadFollowUps();
  };

  const handleEditClick = (e, fu) => {
    e.stopPropagation();
    setSelectedFollowUp(fu);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setSnackbar({ open: true, message: 'Follow-up updated successfully!', severity: 'success' });
    loadFollowUps();
  };

  const handleDeleteClick = (e, fu) => {
    e.stopPropagation();
    setSelectedFollowUp(fu);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteFollowUp(selectedFollowUp.id);
      setSnackbar({ open: true, message: 'Follow-up deleted successfully!', severity: 'success' });
      loadFollowUps();
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
          Follow-ups
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setAddDialogOpen(true)}
        >
          Add Follow-up
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Description"
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
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {['Pending', 'Completed', 'Cancelled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="From"
              type="date"
              size="small"
              value={scheduledAfter}
              onChange={(e) => { setScheduledAfter(e.target.value); setPage(1); }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="To"
              type="date"
              size="small"
              value={scheduledBefore}
              onChange={(e) => { setScheduledBefore(e.target.value); setPage(1); }}
              InputLabelProps={{ shrink: true }}
            />
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
              <TableCell sx={{ fontWeight: 'bold' }}>Scheduled Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {followUps.length > 0 ? (
              followUps.map((fu) => (
                  <TableRow 
                  key={fu.id} 
                  hover 
                  onClick={() => navigate(`/followups/${fu.id}`)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{companyMap[fu.company_id] || 'Unknown'}</TableCell>
                  <TableCell>{new Date(fu.scheduled_date).toLocaleString()}</TableCell>
                  <TableCell>{fu.task_description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={fu.status} 
                      size="small" 
                      variant="outlined" 
                      color={fu.status === 'Completed' ? 'success' : fu.status === 'Cancelled' ? 'error' : 'primary'} 
                    />
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={(e) => handleEditClick(e, fu)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(e, fu)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No follow-ups found.</TableCell></TableRow>
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

      <AddFollowUpDialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)} 
        onSuccess={handleAddSuccess}
        onError={(err) => setSnackbar({ open: true, message: err, severity: 'error' })}
      />

      <EditFollowUpDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        onSuccess={handleEditSuccess}
        onError={(err) => setSnackbar({ open: true, message: err, severity: 'error' })}
        followUp={selectedFollowUp}
      />

      <ConfirmDialog 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Follow-up"
        message="Are you sure you want to delete this follow-up?"
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
