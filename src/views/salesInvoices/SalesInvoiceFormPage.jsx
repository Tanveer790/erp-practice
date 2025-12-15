import { useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded";
import SaveIcon from "@mui/icons-material/SaveRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useParams } from "react-router-dom";
import { useSalesInvoiceFormVM } from "../../viewmodels/salesInvoices/useSalesInvoiceFormVM";

/* ---------------- Helpers ---------------- */

const fmtMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const money = (n) => fmtMoney.format(Number(n ?? 0));

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const getStatusChip = (status) => {
  switch (status) {
    case "POSTED":
      return { label: "Posted", color: "success" };
    case "VOID":
    case "CANCELLED":
      return { label: "Cancelled", color: "error" };
    default:
      return { label: "Draft", color: "warning" };
  }
};

// Small compact width for numeric fields
const compactFieldSx = (minWidth) => ({
  width: "fit-content",
  minWidth,
  "& .MuiInputBase-root": { width: minWidth },
});

/* ---------------- Line Item ---------------- */

function InvoiceLineItem({ line, vm, isReadOnly, index, canRemove }) {
  // safe line total (if vm doesn't supply subTotal on line)
  const lineTotal = useMemo(() => {
    const qty = num(line?.qty);
    const price = num(line?.price);
    const discPct = num(line?.discountPct);
    const taxPct = num(line?.taxPct);

    const base = qty * price;
    const disc = base * (discPct / 100);
    const afterDisc = base - disc;
    const tax = afterDisc * (taxPct / 100);

    return afterDisc + tax;
  }, [line?.qty, line?.price, line?.discountPct, line?.taxPct]);

  return (
    <Card variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
      <Box
        sx={{
          display: "grid",
          gap: 1,
          alignItems: "center",

          // Mobile: stacked
          gridTemplateColumns: { xs: "1fr" },

          // Desktop: one-row layout (compact + description flex)
          "@media (min-width: 900px)": {
            gridTemplateColumns:
              "28px max-content minmax(240px,1fr) max-content max-content max-content max-content max-content 36px",
          },
        }}
      >
        {/* # */}
        <Typography fontWeight={700} color="primary" sx={{ textAlign: "center" }}>
          {index + 1}
        </Typography>

        {/* Item (tight) */}
        <TextField
          select
          size="small"
          label="Item"
          value={line?.itemId ?? ""}
          disabled={isReadOnly}
          onChange={(e) => vm.setLineItem(line.id, e.target.value)}
          sx={{
            ...compactFieldSx(160),
            "& .MuiFormLabel-root": { whiteSpace: "nowrap" },
          }}
        >
          <MenuItem value="">
            <em>Select…</em>
          </MenuItem>
          {(vm.items || []).map((it) => (
            <MenuItem key={it.id} value={it.id}>
              {it.code} - {it.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Description (flex) */}
        <TextField
          size="small"
          label="Description"
          value={line?.description ?? ""}
          disabled={isReadOnly}
          onChange={(e) => vm.updateLine(line.id, { description: e.target.value })}
          fullWidth
          sx={{
            minWidth: 0, // ✅ allow flex shrink/grow inside grid
          }}
        />

        {/* Qty */}
        <TextField
          size="small"
          label="Qty"
          type="number"
          value={line?.qty ?? 1}
          disabled={isReadOnly}
          onChange={(e) => vm.updateLine(line.id, { qty: num(e.target.value) })}
          sx={compactFieldSx(80)}
          inputProps={{ style: { textAlign: "right" } }}
        />

        {/* Price */}
        <TextField
          size="small"
          label="Price"
          type="number"
          value={line?.price ?? 0}
          disabled={isReadOnly}
          onChange={(e) => vm.updateLine(line.id, { price: num(e.target.value) })}
          sx={compactFieldSx(110)}
          inputProps={{ style: { textAlign: "right" } }}
        />

        {/* Disc */}
        <TextField
          size="small"
          label="Disc %"
          type="number"
          value={line?.discountPct ?? 0}
          disabled={isReadOnly}
          onChange={(e) => vm.updateLine(line.id, { discountPct: num(e.target.value) })}
          sx={compactFieldSx(95)}
          inputProps={{ style: { textAlign: "right" } }}
        />

        {/* Tax */}
        <TextField
          size="small"
          label="Tax %"
          type="number"
          value={line?.taxPct ?? 0}
          disabled={isReadOnly}
          onChange={(e) => vm.updateLine(line.id, { taxPct: num(e.target.value) })}
          sx={compactFieldSx(85)}
          inputProps={{ style: { textAlign: "right" } }}
        />

        {/* Total (tight) */}
        <Box sx={{ textAlign: "right", minWidth: 110 }}>
          <Typography fontWeight={800}>{money(lineTotal)}</Typography>
          <Typography variant="caption" color="text.secondary">
            Total
          </Typography>
        </Box>

        {/* Delete */}
        <IconButton
          onClick={() => vm.removeLine(line.id)}
          disabled={isReadOnly || !canRemove}
          color="error"
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
}

/* ---------------- Main Page ---------------- */

export default function SalesInvoiceFormPage({ mode }) {
  const { id } = useParams();
  const vm = useSalesInvoiceFormVM({ mode, id });

  const isCreate = mode === "create";
  const status = vm?.invoice?.status ?? "DRAFT";
  const isPosted = status !== "DRAFT";
  const isReadOnly = isPosted || vm.saving;

  const chip = getStatusChip(status);

  if (vm.loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading Invoice…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Toolbar disableGutters sx={{ mb: 2, gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h5" fontWeight={800}>
              {isCreate ? "New Sales Invoice" : `Sales Invoice #${vm.invoice.invoiceNo || id}`}
            </Typography>
            {!isCreate && <Chip size="small" label={chip.label} color={chip.color} />}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Create and manage sales invoices
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={vm.goBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>

          {!isPosted && (
            <Button
              variant="outlined"
              onClick={vm.saveDraft}
              disabled={vm.saving}
              startIcon={vm.saving ? <CircularProgress size={18} /> : <SaveIcon />}
            >
              Save Draft
            </Button>
          )}

          {!isPosted && (
            <Button
              variant="contained"
              color="success"
              onClick={vm.postInvoice}
              disabled={vm.saving}
              startIcon={<SendIcon />}
            >
              Post
            </Button>
          )}
        </Stack>
      </Toolbar>

      {/* Invoice Details */}
      <Card elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            Invoice Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "220px 220px 1fr" },
            }}
          >
            <TextField
              label="Invoice No"
              value={vm.invoice.invoiceNo || "(auto)"}
              disabled
              size="small"
              helperText={!vm.invoice.invoiceNo ? "Assigned on first save" : " "}
            />

            <TextField
              type="date"
              label="Invoice Date"
              value={vm.invoice.date}
              onChange={(e) => vm.setField("date", e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              disabled={isReadOnly}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              label="Customer"
              value={vm.invoice.customerId ?? ""}
              onChange={(e) => vm.setCustomer(e.target.value)}
              size="small"
              disabled={isReadOnly}
            >
              <MenuItem value="">
                <em>Select customer…</em>
              </MenuItem>
              {(vm.customers || []).map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name || c.customerName || `Customer #${c.id}`}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            label="Notes"
            value={vm.invoice.notes ?? ""}
            onChange={(e) => vm.setField("notes", e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ mt: 2 }}
            size="small"
            disabled={isReadOnly}
          />
        </CardContent>
      </Card>

      {/* Lines */}
      <Card elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Line Items
            </Typography>

            {!isReadOnly && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={vm.addLine}
              >
                Add Line
              </Button>
            )}
          </Stack>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1.5}>
            {(vm.invoice.lines || []).map((l, i) => (
              <InvoiceLineItem
                key={l.id}
                line={l}
                vm={vm}
                index={i}
                isReadOnly={isReadOnly}
                canRemove={(vm.invoice.lines || []).length > 1}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Totals */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Card elevation={2} sx={{ width: { xs: "100%", sm: 420 }, borderRadius: 2 }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>
              Summary
            </Typography>

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Sub Total</Typography>
                <Typography fontWeight={600}>{money(vm.totals.subTotal)}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Discount</Typography>
                <Typography color="error" fontWeight={600}>
                  - {money(vm.totals.discountTotal)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Tax</Typography>
                <Typography fontWeight={600}>{money(vm.totals.taxTotal)}</Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight={900}>
                  Grand Total
                </Typography>
                <Typography variant="h6" fontWeight={900}>
                  {money(vm.totals.grandTotal)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
