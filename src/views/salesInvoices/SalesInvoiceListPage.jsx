import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Stack,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useNavigate } from "react-router-dom"
import { useSalesInvoiceListVM } from "../../viewmodels/salesInvoices/useSalesInvoiceListVM"

import EditIcon from "@mui/icons-material/Edit"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import BlockIcon from "@mui/icons-material/Block"

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
      headerName: "Total Invoice",
      width: 140,
      renderCell: (p) => Number(p?.row?.grandTotal ?? 0).toFixed(2),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      filterable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => nav(`${p.row.id}`)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Post">
            <span>
              <IconButton
                size="small"
                onClick={() => vm.post(p.row.id)}
                disabled={p.row.status !== "DRAFT"}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Cancel">
            <span>
              <IconButton
                size="small"
                onClick={() => vm.cancel(p.row.id)}
                disabled={p.row.status === "CANCELLED"}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Sales Invoices</Typography>
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
              onRowDoubleClick={(p) => nav(`${p.row.id}`)}
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  )
}
