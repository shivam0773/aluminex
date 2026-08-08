import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Alert, CircularProgress } from '@mui/material';
import { createSalesOrder, fetchCompanies, fetchContacts, fetchProducts } from '../services/api';
import SalesOrderForm from '../components/salesOrder/SalesOrderForm';

const INITIAL_STATE = {
  order_number: '',
  company_id: '',
  contact_person_id: '',
  order_date: new Date().toISOString().split('T')[0],
  currency: 'USD',
  subtotal: 0,
  tax_amount: 0,
  freight: 0,
  grand_total: 0,
  items: []
};

export default function CreateSalesOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    Promise.all([
        fetchCompanies({ page: 1, size: 100 }),
        fetchContacts({ page: 1, size: 100 }),
        fetchProducts({ page: 1, size: 100, is_active: true })
    ]).then(([c, cont, p]) => {
        setCompanies(c.items);
        setContacts(cont.items);
        setProducts(p.items);
        setLoading(false);
    }).catch(err => {
        setError(err.message);
        setLoading(false);
    });
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.company_id) newErrors.company_id = 'Company is required';
    if (!formData.order_number?.trim()) newErrors.order_number = 'Order number is required';
    if (!formData.order_date) newErrors.order_date = 'Order date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && formData.items.length > 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setError(null);
    try {
      await createSalesOrder(formData);
      navigate('/sales-orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Create Sales Order</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <SalesOrderForm formData={formData} onChange={setFormData} errors={errors} companies={companies} contacts={contacts} products={products} loading={submitting} />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Save Draft'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/sales-orders')}>Cancel</Button>
        </Box>
      </Paper>
    </Container>
  );
}
