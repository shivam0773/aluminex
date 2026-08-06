import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination,
  CircularProgress, Alert, Stack, Button, Snackbar, IconButton, Tooltip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchContacts, deleteContact, fetchCompanies } from '../services/api';
import AddContactDialog from '../components/contact/AddContactDialog';
import EditContactDialog from '../components/contact/EditContactDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Contacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 400);
    return () => clearTimeout(handler);
  }, [page, search, companyId]);

  // Separate company fetching
  useEffect(() => {
    fetchCompanies({ page: 1, size: 100 }).then(data => setCompanies(data.items)).catch(console.error);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContacts({ page, size, search, company_id: companyId });
      setContacts(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (e, contact) => {
    e.stopPropagation();
    setSelectedContact(contact);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (e, contact) => {
    e.stopPropagation();
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteContact(selectedContact.id);
      setSnackbar({ open: true, message: 'Contact deleted successfully!', severity: 'success' });
      loadData();
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
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Contacts</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
          Add Contact
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid  size={{xs: 12, md: 6}}>
            <TextField fullWidth size="small" label="Search name or email..." value={search} onChange={(e) => {setSearch(e.target.value); setPage(1);}} />
          </Grid>
          <Grid  size={{xs: 12, md: 6}}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Company</InputLabel>
              <Select value={companyId} label="Filter by Company" onChange={(e) => {setCompanyId(e.target.value); setPage(1);}}>
                <MenuItem value="">All Companies</MenuItem>
                {companies.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <TableRow key={contact.id} hover onClick={() => navigate(`/contacts/${contact.id}`)} sx={{ cursor: 'pointer' }}>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{companies.find(c => c.id === contact.company_id)?.name || '-'}</TableCell>
                  <TableCell>{contact.designation || '-'}</TableCell>
                  <TableCell>{contact.phone || '-'}</TableCell>
                  <TableCell>{contact.email || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleEditClick(e, contact)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(e, contact)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>No contacts found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack sx={{ mt: 3, alignItems: 'center' }}>
        <Pagination count={Math.max(1, Math.ceil(total / size))} page={page} onChange={(e, v) => setPage(v)} color="primary" />
      </Stack>

      <AddContactDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSuccess={loadData} companies={companies} />
      <EditContactDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} onSuccess={loadData} contact={selectedContact} companies={companies} />
      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleConfirmDelete} loading={deleteLoading} title="Delete Contact" message={`Are you sure you want to delete ${selectedContact?.name}?`} />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
