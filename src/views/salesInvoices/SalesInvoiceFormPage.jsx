import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import { useParams } from "react-router-dom"
import { useSalesInvoiceFormVM } from "../../viewmodels/salesInvoices/useSalesInvoiceFormVM"

const money = (n) => Number(n ?? 0).toFixed(2)

export default function SalesInvoiceFormPage({ mode }) {
  const { id } = useParams()
  const vm = useSalesInvoiceFormVM({ mode, id })

  if (vm.loading) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">
          {mode === "create"
            ? "New Sales Invoice"
            : `Sales Invoice (${vm.invoice.invoiceNo || id})`}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={vm.goBack}>
            Back
          </Button>
          <Button variant="contained" onClick={vm.saveDraft} disabled={vm.saving}>
            {vm.saving ? "Saving..." : "Save Draft"}
          </Button>
        </Stack>
      </Stack>

      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Invoice Header
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Invoice No" value={vm.invoice.invoiceNo || "(auto)"} disabled fullWidth />

            <TextField
              type="date"
              label="Date"
              value={vm.invoice.date}
              onChange={(e) => vm.setField("date", e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              select
              label="Customer"
              value={vm.invoice.customerId}
              onChange={(e) => vm.setCustomer(e.target.value)}
              fullWidth
            >
              {vm.customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name || c.customerName || `Customer #${c.id}`}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            label="Notes"
            value={vm.invoice.notes ?? ""}
            onChange={(e) => vm.setField("notes", e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ mt: 2 }}
          />
        </CardContent>
      </Card>

      {/* Lines */}
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">Invoice Lines</Typography>
            <Button startIcon={<AddIcon />} onClick={vm.addLine}>
              Add Line
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>
            {vm.invoice.lines.map((l) => (
  <Box
    key={l.id}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      p: 2,
    }}
  >
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
      {/* ✅ Item */}
      <TextField
        select
        label="Item"
        value={l.itemId ?? ""}
        onChange={(e) => vm.setLineItem(l.id, e.target.value)}
        sx={{ minWidth: 100 }}
      >
        <MenuItem value="">
          <em>Select item...</em>
        </MenuItem>

        {vm.items.map((it) => (
          <MenuItem key={it.id} value={it.id}>
            {it.code} - {it.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Description (editable) */}
      <TextField
        label="Description"
        value={l.description ?? ""}
        onChange={(e) => vm.updateLine(l.id, { description: e.target.value })}
        fullWidth
      />

      <TextField
        label="Qty"
        type="number"
        value={l.qty ?? 1}
        onChange={(e) => vm.updateLine(l.id, { qty: Number(e.target.value || 0) })}
        sx={{ width: 120 }}
      />

      <TextField
        label="Price"
        type="number"
        value={l.price ?? 0}
        onChange={(e) => vm.updateLine(l.id, { price: Number(e.target.value || 0) })}
        sx={{ width: 140 }}
      />

      <TextField
        label="Disc %"
        type="number"
        value={l.discountPct ?? 0}
        onChange={(e) => vm.updateLine(l.id, { discountPct: Number(e.target.value || 0) })}
        sx={{ width: 120 }}
      />

      <TextField
        label="Tax %"
        type="number"
        value={l.taxPct ?? 0}
        onChange={(e) => vm.updateLine(l.id, { taxPct: Number(e.target.value || 0) })}
        sx={{ width: 120 }}
      />

      <IconButton
        onClick={() => vm.removeLine(l.id)}
        disabled={vm.invoice.lines.length === 1}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  </Box>
))}

          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Totals */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="flex-end">
            <Box sx={{ minWidth: 260 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Sub Total</Typography>
                <Typography>{money(vm.totals.subTotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Discount</Typography>
                <Typography>- {money(vm.totals.discountTotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Tax</Typography>
                <Typography>{money(vm.totals.taxTotal)}</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700}>Grand Total</Typography>
                <Typography fontWeight={700}>{money(vm.totals.grandTotal)}</Typography>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
