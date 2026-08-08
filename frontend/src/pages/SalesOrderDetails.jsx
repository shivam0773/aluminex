import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchSalesOrder, fetchCompanies } from '../services/api';

export default function SalesOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salesOrder, setSalesOrder] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
        fetchSalesOrder(id),
        fetchCompanies({ page: 1, size: 100 })
    ]).then(([so, c]) => {
      setSalesOrder(so);
      setCompanies(c.items);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!salesOrder) return <Alert severity="warning">Sales Order not found</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/sales-orders')} sx={{ mb: 2 }}>Back to Sales Orders</Button>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Sales Order {salesOrder.order_number}</Typography>
        </Box>
        <Stack spacing={2}>
            <Typography><strong>Company:</strong> {companies.find(c => c.id === salesOrder.company_id)?.name}</Typography>
            <Typography><strong>Status:</strong> {salesOrder.status}</Typography>
            <Typography><strong>Date:</strong> {salesOrder.order_date}</Typography>
            <Typography><strong>Total:</strong> {salesOrder.currency} {salesOrder.grand_total}</Typography>
        </Stack>
        <TableContainer sx={{ mt: 3 }}>
            <Table size="small">
                <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Qty</TableCell><TableCell>Price</TableCell><TableCell>Total</TableCell></TableRow></TableHead>
                <TableBody>
                    {salesOrder.items.map(i => (
                        <TableRow key={i.id}><TableCell>{i.product_name_snapshot}</TableCell><TableCell>{i.quantity} {i.unit}</TableCell><TableCell>{i.unit_price}</TableCell><TableCell>{i.line_total}</TableCell></TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
