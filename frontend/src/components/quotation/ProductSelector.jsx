import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

export default function ProductSelector({ value, onChange, label = "Product", products = [], loading = false, ...props }) {
  return (
    <FormControl fullWidth margin="dense" {...props}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value ?? ''}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      >
        {loading && <MenuItem disabled><CircularProgress size={20} /></MenuItem>}
        {!loading && products.map((p) => (
          <MenuItem key={p.id} value={p.id}>{p.code} - {p.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
