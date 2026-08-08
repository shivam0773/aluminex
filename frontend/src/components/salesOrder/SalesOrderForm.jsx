import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import SalesOrderItemsTable from './SalesOrderItemsTable';

export default function SalesOrderForm({ formData, onChange, errors, companies, contacts, products, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleItemsChange = (items) => {
    // Re-calculate totals
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0), 0);
    const tax_amount = items.reduce((sum, item) => sum + ((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)) * (parseFloat(item.tax_rate) || 0) / 100, 0);
    const grand_total = subtotal + tax_amount + (parseFloat(formData.freight) || 0);
    
    onChange({ ...formData, items, subtotal, tax_amount, grand_total });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField required fullWidth label="Order Number" name="order_number" value={formData.order_number || ''} onChange={handleChange} error={!!errors.order_number} helperText={errors.order_number} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth margin="dense" error={!!errors.company_id}>
            <InputLabel>Company *</InputLabel>
            <Select name="company_id" value={formData.company_id || ''} label="Company *" onChange={(e) => {
              handleChange(e);
              onChange({ ...formData, company_id: e.target.value, contact_person_id: '' });
            }}>
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Contact Person</InputLabel>
            <Select name="contact_person_id" value={formData.contact_person_id || ''} label="Contact Person" onChange={handleChange}>
              <MenuItem value=""><em>None</em></MenuItem>
              {contacts.filter(c => parseInt(c.company_id) === parseInt(formData.company_id)).map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField required fullWidth label="Order Date" name="order_date" type="date" value={formData.order_date || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Expected Delivery Date" name="expected_delivery_date" type="date" value={formData.expected_delivery_date || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Freight" name="freight" type="number" value={formData.freight || 0} onChange={handleChange} margin="dense" />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <SalesOrderItemsTable items={formData.items || []} onChange={handleItemsChange} products={products} loading={loading} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Notes" name="notes" multiline rows={2} value={formData.notes || ''} onChange={handleChange} margin="dense" />
        </Grid>
      </Grid>
    </Box>
  );
}
