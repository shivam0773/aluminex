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
  contact_person_id: '',
  channel: 'Email',
  summary: '',
  date: new Date().toISOString().slice(0, 16)
};

export default function CommunicationForm({ initialData, onChange, errors, companies, contacts }) {
  const [formData, setFormData] = useState(initialData || INITIAL_STATE);
  const channels = ['Email', 'WhatsApp', 'Call', 'Meeting'];

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
        <Grid size={{xs: 12}}>
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
        <Grid size={{xs: 12}}>
          <FormControl fullWidth margin="dense">
            <InputLabel id="contact-label">Contact Person</InputLabel>
            <Select
              labelId="contact-label"
              name="contact_person_id"
              value={formData.contact_person_id || ''}
              label="Contact Person"
              onChange={handleChange}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {contacts && contacts
                .filter(c => !formData.company_id || c.company_id === parseInt(formData.company_id))
                .map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid  size={{xs: 12, sm: 6}}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Channel</InputLabel>
            <Select
              name="channel"
              value={formData.channel || 'Email'}
              label="Channel"
              onChange={handleChange}
            >
              {channels.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid  size={{xs: 12, sm: 6}}>
          <TextField
            required
            fullWidth
            label="Date"
            name="date"
            type="datetime-local"
            value={formData.date ? formData.date.slice(0, 16) : ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date}
            margin="dense"
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <TextField
            required
            fullWidth
            label="Summary"
            name="summary"
            multiline
            rows={3}
            value={formData.summary || ''}
            onChange={handleChange}
            error={!!errors.summary}
            helperText={errors.summary}
            margin="dense"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
