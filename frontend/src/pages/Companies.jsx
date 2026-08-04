import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
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
import { fetchCompanies, deleteCompany } from '../services/api';
import AddCompanyDialog from '../components/company/AddCompanyDialog';
import EditCompanyDialog from '../components/company/EditCompanyDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [product, setProduct] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dialog & Snackbar state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const statuses = ['Lead', 'Contacted', 'Negotiation', 'Customer', 'Lost'];
  const products = [
    'LM25', 'ADC12', 'A380', 'A356', '6063 Billet', 
    'UBC', 'Tense', 'Taint Tabor', 'Zorba', 'Custom'
  ];

  useEffect(() => {
    loadCompanies();
  }, [page, search, status, product]);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCompanies({ page, size, search, status, product });
      setCompanies(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setSnackbar({ open: true, message: 'Company created successfully!', severity: 'success' });
    loadCompanies();
  };

  const handleEditClick = (e, company) => {
    e.stopPropagation();
    setSelectedCompany(company);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setSnackbar({ open: true, message: 'Company updated successfully!', severity: 'success' });
    loadCompanies();
  };

  const handleDeleteClick = (e, company) => {
    e.stopPropagation();
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCompany(selectedCompany.id);
      setSnackbar({ open: true, message: 'Company deleted successfully!', severity: 'success' });
      loadCompanies();
      setDeleteDialogOpen(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/companies/${id}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          Companies
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setAddDialogOpen(true)}
        >
          Add Company
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search name, city, state..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Product Interest</InputLabel>
              <Select
                value={product}
                label="Product Interest"
                onChange={(e) => { setProduct(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Products</MenuItem>
                {products.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <TableContainer component={Paper} sx={{ position: 'relative', minHeight: '200px' }}>
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, left: 0, right: 0, bottom: 0, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Industry</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Interests</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <TableRow
                  key={company.id}
                  hover
                  onClick={() => handleRowClick(company.id)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {company.name}
                  </TableCell>
                  <TableCell>
                    {company.addresses && company.addresses.length > 0 
                      ? `${company.addresses[0].city}, ${company.addresses[0].state}` 
                      : '-'}
                  </TableCell>
                  <TableCell>{company.industry || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={company.status} 
                      size="small" 
                      color={
                        company.status === 'Customer' ? 'success' : 
                        company.status === 'Lost' ? 'error' : 
                        company.status === 'Negotiation' ? 'warning' : 'primary'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {company.product_interests && company.product_interests.map((pi) => (
                        <Chip key={pi.id} label={pi.product} size="small" variant="filled" sx={{ fontSize: '0.7rem' }} />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={(e) => handleEditClick(e, company)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(e, company)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No companies found.
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
        <Pagination 
          count={Math.ceil(total / size)} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Stack>

      <AddCompanyDialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)} 
        onSuccess={handleAddSuccess}
      />

      <EditCompanyDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        onSuccess={handleEditSuccess}
        company={selectedCompany}
      />

      <ConfirmDialog 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Company"
        message={`Are you sure you want to delete ${selectedCompany?.name}? This action cannot be undone.`}
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
