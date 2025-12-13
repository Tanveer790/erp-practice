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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { usePurchaseInvoiceFormVM } from "../../viewmodels/purchaseInvoices/usePurchaseInvoiceFormVM";

const money = (n) => Number(n ?? 0).toFixed(2);

export default function PurchaseInvoiceFormPage({ mode }) {
  const { id } = useParams();
  const vm = usePurchaseInvoiceFormVM({ mode, id });

  if (vm.loading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">
          {mode === "create"
            ? "New Purchase Invoice"
            : `Purchase Invoice (${vm.invoice.invoiceNo || id})`}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={vm.goBack}>Back</Button>
          <Button variant="contained" onClick={vm.saveDraft} disabled={vm.saving}>
            {vm.saving ? "Saving..." : "Save Draft"}
          </Button>
        </Stack>
      </Stack>

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
  label="Supplier"
  value={vm.invoice.supplierId ?? ""}
  onChange={(e) => {
    const sid = e.target.value;
    const s = vm.suppliers.find(x => String(x.id) === String(sid));
    vm.setField("supplierId", sid);
    vm.setField("supplierName", s?.name || "");
  }}
  fullWidth
>
  <MenuItem value=""><em>Select supplier...</em></MenuItem>
  {vm.suppliers.map((s) => (
    <MenuItem key={s.id} value={s.id}>
      {s.code} - {s.name}
    </MenuItem>
  ))}
</TextField>

          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
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
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}
              >
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
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

                  <TextField
                    label="Description"
                    value={l.description ?? ""}
                    onChange={(e) =>
                      vm.updateLine(l.id, { description: e.target.value })
                    }
                    fullWidth
                  />

                  <TextField
                    label="Qty"
                    type="number"
                    value={l.qty ?? 1}
                    onChange={(e) =>
                      vm.updateLine(l.id, { qty: Number(e.target.value || 0) })
                    }
                    sx={{ width: 120 }}
                  />

                  <TextField
                    label="Cost"
                    type="number"
                    value={l.cost ?? 0}
                    onChange={(e) =>
                      vm.updateLine(l.id, { cost: Number(e.target.value || 0) })
                    }
                    sx={{ width: 140 }}
                  />

                  <IconButton
                    onClick={() => vm.removeLine(l.id)}
                    disabled={vm.invoice.lines.length === 1}
                  >
                    <Button
  variant="contained"
  color="success"
  onClick={vm.postInvoice}
  disabled={vm.saving || vm.invoice.status === "POSTED"}
>
  {vm.invoice.status === "POSTED" ? "Posted" : "Post"}
</Button>

                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" justifyContent="flex-end">
            <Typography fontWeight={700}>
              Grand Total: {money(vm.totals.grandTotal)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
