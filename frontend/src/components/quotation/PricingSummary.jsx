import React from 'react';
import { Box, Typography, Divider, Stack } from '@mui/material';

export default function PricingSummary({ subtotal, discount, tax, freight, insurance, other, grandTotal }) {
  return (
    <Box sx={{ width: 300, ml: 'auto', mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Stack spacing={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Subtotal:</Typography><Typography>{subtotal.toFixed(2)}</Typography></Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Discount:</Typography><Typography>-{discount.toFixed(2)}</Typography></Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Tax:</Typography><Typography>{tax.toFixed(2)}</Typography></Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Freight:</Typography><Typography>{freight.toFixed(2)}</Typography></Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Insurance:</Typography><Typography>{insurance.toFixed(2)}</Typography></Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography>Other:</Typography><Typography>{other.toFixed(2)}</Typography></Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <Typography variant="h6">Grand Total:</Typography>
            <Typography variant="h6">{grandTotal.toFixed(2)}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
