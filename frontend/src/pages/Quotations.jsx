import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Pagination, CircularProgress, Alert, Button, Stack,
  Snackbar, IconButton, Tooltip, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchQuotations, deleteQuotation, fetchCompanies } from '../services/api';
import QuotationStatusChip from '../components/quotation/QuotationStatusChip';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Quotations() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCompanies({ page: 1, size: 100 }).then(data => setCompanies(data.items));
  }, []);

  useEffect(() => {
    loadQuotations();
  }, [page, search, companyId, status]);

  const loadQuotations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuotations({ page, size, search, company_id: companyId, status });
      setQuotations(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (e, q) => {
    e.stopPropagation();
    navigate(`/quotations/${q.id}/edit`);
  };

  const handleDeleteClick = (e, q) => {
    e.stopPropagation();
    setSelectedQuotation(q);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteQuotation(selectedQuotation.id);
      setSnackbar({ open: true, message: 'Quotation deleted successfully!', severity: 'success' });
      loadQuotations();
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
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Quotations</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/quotations/new')}>Add Quotation</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid  size={{xs: 12, md: 3}}>
            <TextField fullWidth size="small" label="Search Number" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </Grid>
          <Grid  size={{xs: 12, md: 3}}>
            <FormControl fullWidth size="small">
              <InputLabel>Company</InputLabel>
              <Select value={companyId} label="Company" onChange={(e) => { setCompanyId(e.target.value); setPage(1); }}>
                <MenuItem value="">All Companies</MenuItem>
                {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid  size={{xs: 12, md: 2}}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={status} label="Status" onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                <MenuItem value="">All</MenuItem>
                {['Draft', 'Sent', 'Accepted', 'Rejected', 'Cancelled'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ position: 'relative', minHeight: '200px' }}>
        {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', mt: -2, ml: -2 }} />}
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Valid Until</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.map(q => (
              <TableRow key={q.id} hover onClick={() => navigate(`/quotations/${q.id}`)} sx={{ cursor: 'pointer' }}>
                <TableCell>{q.quotation_number}</TableCell>
                <TableCell>{companies.find(c => c.id === q.company_id)?.name}</TableCell>
                <TableCell>{q.quotation_date}</TableCell>
                <TableCell>{q.validity_date}</TableCell>
                <TableCell>{q.currency} {q.grand_total}</TableCell>
                <TableCell><QuotationStatusChip status={q.status} /></TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Edit"><IconButton size="small" onClick={(e) => handleEditClick(e, q)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                  <Tooltip title="Delete"><IconButton size="small" color="error" onClick={(e) => handleDeleteClick(e, q)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} count={Math.ceil(total / size)} page={page} onChange={(e, v) => setPage(v)} color="primary" />

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} loading={deleteLoading} title="Delete Quotation" message="Are you sure you want to delete this quotation?" />
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />
    </Container>
  );
}
