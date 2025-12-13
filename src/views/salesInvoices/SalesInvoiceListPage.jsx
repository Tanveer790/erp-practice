import { Box, Button, Card, CardContent, Chip, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useNavigate } from "react-router-dom"
import { useSalesInvoiceListVM } from "../../viewmodels/salesInvoices/useSalesInvoiceListVM"

const statusChip = (status) => {
  if (status === "POSTED") return <Chip size="small" label="Posted" />
  if (status === "CANCELLED") return <Chip size="small" label="Cancelled" />
  return <Chip size="small" label="Draft" />
}

export default function SalesInvoiceListPage() {
  const nav = useNavigate()
  const vm = useSalesInvoiceListVM()

  const columns = [
    { field: "invoiceNo", headerName: "Invoice No", flex: 1, minWidth: 130 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "customerName", headerName: "Customer", flex: 1, minWidth: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (p) => statusChip(p.value),
    },
    {
      field: "grandTotal",
      headerName: "Total",
      width: 130,
      valueGetter: (p) => p.row?.totals?.grandTotal ?? 0,
      valueFormatter: (p) => Number(p.value ?? 0).toFixed(2),
    },
  ]

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Sales Invoices</Typography>

        {/* ✅ nested route: use relative navigation */}
        <Button variant="contained" onClick={() => nav("new")}>
          New Invoice
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Search (Invoice No / Customer)"
              value={vm.q}
              onChange={(e) => vm.setQ(e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={vm.status}
              onChange={(e) => vm.setStatus(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="POSTED">Posted</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>
          </Stack>

          <div style={{ height: 520, width: "100%" }}>
            <DataGrid
              rows={vm.rows}
              columns={columns}
              loading={vm.loading}
              getRowId={(r) => r.id}
              pageSizeOptions={[10, 25, 50]}
              onRowDoubleClick={(p) => nav(`${p.row.id}`)}  // ✅ relative
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  )
}
