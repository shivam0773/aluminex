import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchQuotation, fetchCompanies } from '../services/api';
import QuotationStatusChip from '../components/quotation/QuotationStatusChip';

export default function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
        fetchQuotation(id),
        fetchCompanies({ page: 1, size: 100 })
    ]).then(([q, c]) => {
      setQuotation(q);
      setCompanies(c.items);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!quotation) return <Alert severity="warning">Quotation not found</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/quotations')} sx={{ mb: 2 }}>Back to Quotations</Button>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Quotation {quotation.quotation_number}</Typography>
            <QuotationStatusChip status={quotation.status} />
        </Box>
        <Stack spacing={2}>
            <Typography><strong>Company:</strong> {companies.find(c => c.id === quotation.company_id)?.name}</Typography>
            <Typography><strong>Dates:</strong> {quotation.quotation_date} - {quotation.validity_date}</Typography>
            <Typography><strong>Total:</strong> {quotation.currency} {quotation.grand_total}</Typography>
        </Stack>
        <TableContainer sx={{ mt: 3 }}>
            <Table size="small">
                <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Qty</TableCell><TableCell>Price</TableCell><TableCell>Total</TableCell></TableRow></TableHead>
                <TableBody>
                    {quotation.items.map(i => (
                        <TableRow key={i.id}><TableCell>{i.product_name}</TableCell><TableCell>{i.quantity} {i.unit}</TableCell><TableCell>{i.unit_price}</TableCell><TableCell>{i.line_total}</TableCell></TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
