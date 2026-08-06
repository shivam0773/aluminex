import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';

const INITIAL_STATE = {
  name: '',
  industry: '',
  company_type: '',
  website: '',
  gst: '',
  phone: '',
  email: '',
  linkedin: '',
  annual_capacity: '',
  status: 'Lead',
  lead_source: ''
};

export default function CompanyForm({ initialData, onChange, errors }) {
  const [formData, setFormData] = useState(initialData || INITIAL_STATE);

  const statuses = ['Lead', 'Contacted', 'Negotiation', 'Customer', 'Lost'];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Auto prepend https:// for website
    if (name === 'website' && value && !/^https?:\/\//i.test(value) && value.length > 5) {
        if (!value.startsWith('http')) {
            newValue = `https://${value}`;
        }
    }

    const updatedData = { ...formData, [name]: newValue };
    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            required
            fullWidth
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="Industry"
            name="industry"
            value={formData.industry || ''}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="Company Type"
            name="company_type"
            value={formData.company_type || ''}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            placeholder="example.com"
            value={formData.website || ''}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="GST"
            name="gst"
            value={formData.gst || ''}
            onChange={handleChange}
            error={!!errors.gst}
            helperText={errors.gst}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="LinkedIn"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="Annual Capacity (Tons)"
            name="annual_capacity"
            type="number"
            value={formData.annual_capacity || ''}
            onChange={handleChange}
            error={!!errors.annual_capacity}
            helperText={errors.annual_capacity}
            margin="dense"
            inputProps={{ min: 0 }}
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status || 'Lead'}
              label="Status"
              onChange={handleChange}
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{xs: 12}}>
          <TextField
            fullWidth
            label="Lead Source"
            name="lead_source"
            value={formData.lead_source || ''}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
