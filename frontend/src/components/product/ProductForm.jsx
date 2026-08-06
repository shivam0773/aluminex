import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';

const INITIAL_STATE = {
  code: '',
  name: '',
  category: '',
  price: '',
  description: '',
  is_active: true
};

export default function ProductForm({ initialData, onChange, errors }) {
  const [formData, setFormData] = useState(initialData || INITIAL_STATE);
  const categories = ['Aluminium', 'Alloy', 'Billet', 'Scrap', 'Other'];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const updatedData = { ...formData, [name]: val };
    setFormData(updatedData);
    onChange(updatedData);
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid  size={{xs: 12, sm: 6}}>
          <TextField
            required
            fullWidth
            label="Product Code"
            name="code"
            value={formData.code || ''}
            onChange={handleChange}
            error={!!errors.code}
            helperText={errors.code}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, sm: 6}}>
          <TextField
            required
            fullWidth
            label="Product Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="dense"
          />
        </Grid>
        <Grid  size={{xs: 12, sm: 6}}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category || ''}
              label="Category"
              onChange={handleChange}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid  size={{xs: 12, sm: 6}}>
          <TextField
            required
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price || ''}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            margin="dense"
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description || ''}
            onChange={handleChange}
            margin="dense"
          />
        </Grid>
        <Grid size={{xs: 12}}>
          <FormControlLabel
            control={
              <Switch
                name="is_active"
                checked={!!formData.is_active}
                onChange={handleChange}
              />
            }
            label="Active"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
