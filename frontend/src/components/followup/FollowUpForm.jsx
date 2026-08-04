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
  scheduled_date: '',
  task_description: '',
  status: 'Pending'
};

export default function FollowUpForm({ initialData, onChange, errors, companies }) {
  // Use initialData or INITIAL_STATE directly in useState to keep state synced
  const [formData, setFormData] = useState(initialData || INITIAL_STATE);
  const statuses = ['Pending', 'Completed', 'Cancelled'];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    // Pass latest state to parent
    onChange(updatedData);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Scheduled Date"
            name="scheduled_date"
            type="datetime-local"
            value={formData.scheduled_date ? formData.scheduled_date.slice(0, 16) : ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.scheduled_date}
            helperText={errors.scheduled_date}
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Task Description"
            name="task_description"
            multiline
            rows={3}
            value={formData.task_description || ''}
            onChange={handleChange}
            error={!!errors.task_description}
            helperText={errors.task_description}
            margin="dense"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status || 'Pending'}
              label="Status"
              onChange={handleChange}
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
