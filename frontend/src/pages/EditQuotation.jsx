import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Alert, CircularProgress } from '@mui/material';
import { updateQuotation, fetchQuotation, fetchCompanies, fetchContacts, fetchProducts } from '../services/api';
import QuotationForm from '../components/quotation/QuotationForm';
import PricingSummary from '../components/quotation/PricingSummary';

export default function EditQuotation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchQuotation(id),
      fetchCompanies({ page: 1, size: 100 }),
      fetchContacts({ page: 1, size: 100 }),
      fetchProducts({ page: 1, size: 100, is_active: true })
    ]).then(([q, c, cont, p]) => {
      setFormData(q);
      setCompanies(c.items);
      setContacts(cont.items);
      setProducts(p.items);
      setLoading(false);
    }).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [id]);

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
    setSaving(true);
    setError(null);
    try {
      await updateQuotation(id, formData);
      navigate('/quotations');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!formData) return <Alert severity="error">Quotation not found</Alert>;

  // UI Preview totals
  const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (1 - item.discount_pct / 100)), 0);
  const discount = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (item.discount_pct / 100)), 0);
  const tax = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price * (1 - item.discount_pct / 100) * (item.tax_rate_pct / 100)), 0);
  const grandTotal = subtotal + tax + parseFloat(formData.freight || 0) + parseFloat(formData.insurance || 0) + parseFloat(formData.other_charges || 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>Edit Quotation</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper sx={{ p: 3 }}>
        <QuotationForm formData={formData} onChange={setFormData} errors={errors} companies={companies} contacts={contacts} products={products} loading={loading} />
        <PricingSummary subtotal={subtotal} discount={discount} tax={tax} freight={parseFloat(formData.freight || 0)} insurance={parseFloat(formData.insurance || 0)} other={parseFloat(formData.other_charges || 0)} grandTotal={grandTotal} />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleSubmit} disabled={saving}>{saving ? <CircularProgress size={24} /> : 'Save Changes'}</Button>
            <Button variant="outlined" onClick={() => navigate('/quotations')}>Cancel</Button>
        </Box>
      </Paper>
    </Container>
  );
}
