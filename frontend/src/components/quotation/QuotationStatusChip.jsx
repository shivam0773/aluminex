import React from 'react';
import { Chip } from '@mui/material';

export default function QuotationStatusChip({ status }) {
  const getColor = (status) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Sent': return 'primary';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      case 'Cancelled': return 'warning';
      default: return 'default';
    }
  };

  return <Chip label={status} size="small" variant="outlined" color={getColor(status)} />;
}
