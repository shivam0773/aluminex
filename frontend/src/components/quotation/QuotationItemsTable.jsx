import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductSelector from './ProductSelector';

export default function QuotationItemsTable({ items, onChange, products, loading }) {
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill product details if product_id changes
    if (field === 'product_id') {
      const productId = parseInt(value, 10);
      const product = products.find(p => p.id === productId);
      if (product) {
        newItems[index].product_code = product.code;
        newItems[index].product_name = product.name;
        newItems[index].unit_price = product.price;
      }
    }
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, { product_id: '', product_code: '', product_name: '', description: '', quantity: 1, unit: 'MT', unit_price: 0, discount_pct: 0, tax_rate_pct: 0 }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const numericFieldProps = {
    type: 'number',
    size: 'small',
    inputProps: { 
        style: { textAlign: 'right' },
        onFocus: (e) => e.target.select()
    },
    sx: {
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
        '& input[type=number]': {
            '-moz-appearance': 'textfield',
        },
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small" sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 260 }}>Product</TableCell>
              <TableCell sx={{ width: 220 }}>Description</TableCell>
              <TableCell sx={{ width: 110 }} align="right">Qty</TableCell>
              <TableCell sx={{ width: 90 }}>Unit</TableCell>
              <TableCell sx={{ width: 140 }} align="right">Price</TableCell>
              <TableCell sx={{ width: 110 }} align="right">Disc %</TableCell>
              <TableCell sx={{ width: 110 }} align="right">Tax %</TableCell>
              <TableCell sx={{ width: 140 }} align="right">Total</TableCell>
              <TableCell sx={{ width: 50 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} sx={{ height: 60 }}>
                <TableCell>
                  <ProductSelector
                    value={item.product_id}
                    onChange={(val) => handleItemChange(index, 'product_id', val)}
                    products={products}
                    loading={loading}
                    label=""
                    sx={{ m: 0 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField size="small" fullWidth value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField {...numericFieldProps} value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))} />
                </TableCell>
                <TableCell>
                  <TextField size="small" fullWidth value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField {...numericFieldProps} value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} />
                </TableCell>
                <TableCell>
                  <TextField {...numericFieldProps} value={item.discount_pct} onChange={(e) => handleItemChange(index, 'discount_pct', parseFloat(e.target.value))} />
                </TableCell>
                <TableCell>
                  <TextField {...numericFieldProps} value={item.tax_rate_pct} onChange={(e) => handleItemChange(index, 'tax_rate_pct', parseFloat(e.target.value))} />
                </TableCell>
                <TableCell align="right" sx={{ pr: 2 }}>
                  {((item.quantity * item.unit_price * (1 - item.discount_pct / 100)) * (1 + item.tax_rate_pct / 100)).toFixed(2)}
                </TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => removeItem(index)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button startIcon={<AddIcon />} onClick={addItem} variant="outlined">Add Item</Button>
    </Box>
  );
}
