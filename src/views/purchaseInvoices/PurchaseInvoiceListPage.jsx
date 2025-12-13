import {
  Box, Button, IconButton, MenuItem, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { usePurchaseInvoiceListVM } from "../../viewmodels/purchaseInvoices/usePurchaseInvoiceListVM";

const money = (n) => Number(n ?? 0).toFixed(2);

export default function PurchaseInvoiceListPage() {
  const vm = usePurchaseInvoiceListVM();
  const nav = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>Purchase Invoices</Typography>
          <Typography variant="body2" color="text.secondary">Supplier bills & costs</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={vm.reload}><RefreshIcon /></IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => nav("/purchase-invoices/new")}>
            New Purchase Invoice
          </Button>
        </Stack>
      </Toolbar>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Search (Invoice No / Supplier)"
            value={vm.q}
            onChange={(e) => vm.setQ(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={vm.status}
            onChange={(e) => vm.setStatus(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="POSTED">Posted</MenuItem>
            <MenuItem value="VOID">Void</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Invoice No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Grand Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vm.rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{r.invoiceNo}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell>{r.supplierName}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell align="right">{money(r?.grandTotal ?? r?.totals?.grandTotal)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => nav(`/purchase-invoices/${r.id}`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!vm.loading && vm.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No purchase invoices</Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
