import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchProducts, deleteProduct } from '../services/api';
import AddProductDialog from '../components/product/AddProductDialog';
import EditProductDialog from '../components/product/EditProductDialog';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadProducts();
  }, [page, search, category, isActive]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts({ 
        page, size, search, category, is_active: isActive 
      });
      setProducts(data.items);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setSnackbar({ open: true, message: 'Product created successfully!', severity: 'success' });
    loadProducts();
  };

  const handleEditClick = (e, p) => {
    e.stopPropagation();
    setSelectedProduct(p);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setSnackbar({ open: true, message: 'Product updated successfully!', severity: 'success' });
    loadProducts();
  };

  const handleDeleteClick = (e, p) => {
    e.stopPropagation();
    setSelectedProduct(p);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      setSnackbar({ open: true, message: 'Product deleted successfully!', severity: 'success' });
      loadProducts();
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
          Products
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setAddDialogOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Code/Name"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {['Aluminium', 'Alloy', 'Billet', 'Scrap', 'Other'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
                control={
                    <Switch
                        checked={isActive}
                        onChange={(e) => { setIsActive(e.target.checked); setPage(1); }}
                    />
                }
                label="Active Only"
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
              <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Active</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? (
              products.map((p) => (
                <TableRow 
                  key={p.id} 
                  hover 
                  onClick={() => navigate(`/products/${p.id}`)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{p.code}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>{p.price}</TableCell>
                  <TableCell>{p.is_active ? 'Yes' : 'No'}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={(e) => handleEditClick(e, p)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={(e) => handleDeleteClick(e, p)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>No products found.</TableCell></TableRow>
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

      <AddProductDialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)} 
        onSuccess={handleAddSuccess}
      />

      <EditProductDialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)} 
        onSuccess={handleEditSuccess}
        productId={selectedProduct?.id}
      />

      <ConfirmDialog 
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
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
