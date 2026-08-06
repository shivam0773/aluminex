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
  company_id: '',
  name: '',
  designation: '',
  email: '',
  phone: '',
  whatsapp: '',
  linkedin: ''
};

export default function ContactForm({ initialData, onChange, errors, companies }) {
  const [formData, setFormData] = useState(initialData || INITIAL_STATE);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid  size={{xs: 12, md: 6}}>
          <FormControl fullWidth margin="dense" error={!!errors.company_id}>
            <InputLabel id="company-label">Company *</InputLabel>
            <Select
              labelId="company-label"
              name="company_id"
              value={formData.company_id || ''}
              label="Company *"
              onChange={handleChange}
            >
              <MenuItem value=""><em>Select a Company</em></MenuItem>
              {companies && companies.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
            {errors.company_id && (
              <Typography color="error" variant="caption" sx={{ ml: 2 }}>{errors.company_id}</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            required
            fullWidth
            label="Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, md: 6}}>
          <TextField
            fullWidth
            label="Designation"
            name="designation"
            value={formData.designation || ''}
            onChange={handleChange}
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
            label="WhatsApp"
            name="whatsapp"
            value={formData.whatsapp || ''}
            onChange={handleChange}
            error={!!errors.whatsapp}
            helperText={errors.whatsapp}
            margin="dense"
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <TextField
            fullWidth
            label="LinkedIn URL"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
