import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress
} from '@mui/material';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Confirm Action'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message || 'Are you sure you want to proceed?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error" 
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
