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
import ProductSelector from '../quotation/ProductSelector';

export default function SalesOrderItemsTable({ items, onChange, products, loading }) {
  
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-fill product details if product_id changes
    if (field === 'product_id') {
      const productId = parseInt(value, 10);
      const product = products.find(p => p.id === productId);
      if (product) {
        newItems[index].product_code_snapshot = product.code;
        newItems[index].product_name_snapshot = product.name;
        newItems[index].unit_price = product.price;
        newItems[index].tax_rate = product.tax_rate || 0;
      }
    }
    
    // Re-calculate line total
    const item = newItems[index];
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    const tax = parseFloat(item.tax_rate) || 0;
    
    newItems[index].line_total = (qty * price) * (1 + tax / 100);
    
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, { product_id: '', product_code_snapshot: '', product_name_snapshot: '', description_snapshot: '', quantity: 1, unit: 'MT', unit_price: 0, tax_rate: 0, line_total: 0 }]);
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
        <Table size="small" sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 260 }}>Product</TableCell>
              <TableCell sx={{ width: 220 }}>Description</TableCell>
              <TableCell sx={{ width: 110 }} align="right">Qty</TableCell>
              <TableCell sx={{ width: 90 }}>Unit</TableCell>
              <TableCell sx={{ width: 140 }} align="right">Price</TableCell>
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
                  <TextField size="small" fullWidth value={item.description_snapshot || ''} onChange={(e) => handleItemChange(index, 'description_snapshot', e.target.value)} />
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
                  <TextField {...numericFieldProps} value={item.tax_rate} onChange={(e) => handleItemChange(index, 'tax_rate', parseFloat(e.target.value))} />
                </TableCell>
                <TableCell align="right" sx={{ pr: 2 }}>
                  {parseFloat(item.line_total || 0).toFixed(2)}
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
