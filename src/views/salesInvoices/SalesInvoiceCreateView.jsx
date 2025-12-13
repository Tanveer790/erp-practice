import { Box, Button, Divider, Paper, Stack, TextField, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useSalesInvoiceCreateViewModel } from '../../viewmodels/salesInvoices/useSalesInvoiceCreateViewModel.js';

export default function SalesInvoiceCreateView() {
  const vm = useSalesInvoiceCreateViewModel();
  const navigate = useNavigate();

  const onSave = async () => {
    const res = await vm.save();
    if (!res.ok) {
      alert(res.error);
      return;
    }
    navigate('/sales-invoices');
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight={600}>New Sales Invoice</Typography>
        <Typography variant="body2" color="text.secondary">Create invoice with line items and VAT.</Typography>
      </Box>

      <Paper elevation={1} sx={{ mt: 1, borderRadius: 2, p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Invoice No" value={vm.invoiceNo} fullWidth disabled />
          <TextField label="Date" type="date" value={vm.date} onChange={(e) => vm.setDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Customer Name" value={vm.customerName} onChange={(e) => vm.setCustomerName(e.target.value)} fullWidth />
        </Stack>

        <TextField label="Notes" value={vm.notes} onChange={(e) => vm.setNotes(e.target.value)} fullWidth multiline minRows={2} sx={{ mt: 2 }} />

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>Line Items</Typography>
          <Button startIcon={<AddIcon />} onClick={vm.addLine} sx={{ borderRadius: 999, px: 2.5 }}>
            Add Line
          </Button>
        </Stack>

        <Stack spacing={1.5}>
          {vm.lines.map((l) => (
            <Paper key={l.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
                <TextField
                  label="Item"
                  value={l.itemName}
                  onChange={(e) => vm.updateLine(l.id, { itemName: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Qty"
                  type="number"
                  value={l.qty}
                  onChange={(e) => vm.updateLine(l.id, { qty: Number(e.target.value) })}
                  sx={{ width: 120 }}
                />
                <TextField
                  label="Unit Price"
                  type="number"
                  value={l.unitPrice}
                  onChange={(e) => vm.updateLine(l.id, { unitPrice: Number(e.target.value) })}
                  sx={{ width: 160 }}
                />
                <TextField
                  label="VAT %"
                  type="number"
                  value={l.vatRate}
                  onChange={(e) => vm.updateLine(l.id, { vatRate: Number(e.target.value) })}
                  sx={{ width: 120 }}
                />
                <Box sx={{ minWidth: 140, textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="caption" color="text.secondary">Line Total</Typography>
                  <Typography fontWeight={700}>
                    {(Number(l.qty) * Number(l.unitPrice) * (1 + Number(l.vatRate) / 100)).toFixed(2)}
                  </Typography>
                </Box>
                <IconButton onClick={() => vm.removeLine(l.id)} disabled={vm.lines.length === 1}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="flex-end" spacing={2}>
          <Box sx={{ minWidth: 260 }}>
            <Stack spacing={0.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight={700}>{vm.totals.subTotal.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">VAT</Typography>
                <Typography fontWeight={700}>{vm.totals.vat.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Grand Total</Typography>
                <Typography fontWeight={800}>{vm.totals.total.toFixed(2)}</Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 2 }}>
          <Button variant="text" onClick={() => navigate('/sales-invoices')}>Cancel</Button>
          <Button onClick={onSave}>Save Invoice</Button>
        </Stack>
      </Paper>
    </Box>
  );
}
