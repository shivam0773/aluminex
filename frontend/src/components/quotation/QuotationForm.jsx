import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import QuotationItemsTable from './QuotationItemsTable';

export default function QuotationForm({ formData, onChange, errors, companies, contacts, products, loading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleItemsChange = (items) => {
    onChange({ ...formData, items });
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth margin="dense" error={!!errors.company_id}>
            <InputLabel>Company *</InputLabel>
            <Select name="company_id" value={formData.company_id || ''} label="Company *" onChange={handleChange}>
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Contact Person</InputLabel>
            <Select name="contact_person_id" value={formData.contact_person_id || ''} label="Contact Person" onChange={handleChange}>
              <MenuItem value=""><em>None</em></MenuItem>
              {contacts.filter(c => c.company_id === formData.company_id).map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField required fullWidth label="Quotation Number" name="quotation_number" value={formData.quotation_number || ''} onChange={handleChange} error={!!errors.quotation_number} helperText={errors.quotation_number} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField required fullWidth label="Quotation Date" name="quotation_date" type="date" value={formData.quotation_date || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!errors.quotation_date} helperText={errors.quotation_date} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField required fullWidth label="Validity Date" name="validity_date" type="date" value={formData.validity_date || ''} onChange={handleChange} InputLabelProps={{ shrink: true }} error={!!errors.validity_date} helperText={errors.validity_date} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField required fullWidth label="Currency" name="currency" value={formData.currency || 'USD'} onChange={handleChange} error={!!errors.currency} helperText={errors.currency} margin="dense" />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <QuotationItemsTable items={formData.items || []} onChange={handleItemsChange} products={products} loading={loading} />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Freight" name="freight" type="number" value={formData.freight} onChange={handleChange} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Insurance" name="insurance" type="number" value={formData.insurance} onChange={handleChange} margin="dense" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Other Charges" name="other_charges" type="number" value={formData.other_charges} onChange={handleChange} margin="dense" />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Remarks" name="remarks" multiline rows={2} value={formData.remarks || ''} onChange={handleChange} margin="dense" />
        </Grid>
      </Grid>
    </Box>
  );
}
