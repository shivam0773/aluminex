import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Alert, CircularProgress } from '@mui/material';
import { createQuotation, fetchCompanies, fetchContacts, fetchProducts } from '../services/api';
import QuotationForm from '../components/quotation/QuotationForm';
import PricingSummary from '../components/quotation/PricingSummary';

const INITIAL_STATE = {
  company_id: '',
  contact_person_id: '',
  quotation_number: '',
  quotation_date: new Date().toISOString().split('T')[0],
  validity_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'USD',
  freight: 0,
  insurance: 0,
  other_charges: 0,
  items: []
};

export default function CreateQuotation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLoading(true);
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
    if (!formData.quotation_number.trim()) newErrors.quotation_number = 'Quotation number is required';
    if (!formData.quotation_date) newErrors.quotation_date = 'Date is required';
    if (!formData.validity_date) newErrors.validity_date = 'Validity date is required';
    if (formData.validity_date < formData.quotation_date) newErrors.validity_date = 'Invalid date';
    if (!formData.currency.trim()) newErrors.currency = 'Currency is required';
    if (formData.items.length === 0) setError('At least one item is required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && formData.items.length > 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      await createQuotation(formData);
      navigate('/quotations');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UI Preview totals
  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (1 - item.discount_pct / 100)), 0);
  const discount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (item.discount_pct / 100)), 0);
  const tax = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (1 - item.discount_pct / 100) * (item.tax_rate_pct / 100)), 0);
  const grandTotal = subtotal + tax + parseFloat(formData.freight || 0) + parseFloat(formData.insurance || 0) + parseFloat(formData.other_charges || 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Create Quotation</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <QuotationForm formData={formData} onChange={setFormData} errors={errors} companies={companies} contacts={contacts} products={products} loading={loading} />
        <PricingSummary subtotal={subtotal} discount={discount} tax={tax} freight={parseFloat(formData.freight || 0)} insurance={parseFloat(formData.insurance || 0)} other={parseFloat(formData.other_charges || 0)} grandTotal={grandTotal} />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Save Draft'}</Button>
            <Button variant="outlined" onClick={() => navigate('/quotations')}>Cancel</Button>
        </Box>
      </Paper>
    </Container>
  );
}
