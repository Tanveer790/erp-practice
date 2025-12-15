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
  Toolbar,
  useTheme,
  CircularProgress,
  alpha,
  SvgIcon,
} from "@mui/material";
import { 
  DataGrid, 
  GridToolbar, 
  GridToolbarQuickFilter 
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
// Ensure this path is correct:
import { useSalesInvoiceListVM } from "../../viewmodels/salesInvoices/useSalesInvoiceListVM"; 

import EditIcon from "@mui/icons-material/EditRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircleRounded";
import BlockIcon from "@mui/icons-material/BlockRounded";
import AddIcon from "@mui/icons-material/AddRounded";
import RefreshIcon from "@mui/icons-material/RefreshRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// --- Helper for Status Chip Renderer ---
const useStatusChip = () => {
  const theme = useTheme();

  return (status) => {
    let color;
    let label;
    let chipColor;

    if (status === "POSTED") {
      color = theme.palette.success.main;
      label = "Posted";
      chipColor = "success";
    } else if (status === "CANCELLED") {
      color = theme.palette.error.main;
      label = "Cancelled";
      chipColor = "error";
    } else {
      color = theme.palette.warning.main;
      label = "Draft";
      chipColor = "warning";
    }

    return (
      <Chip 
        size="small" 
        label={label} 
        color={chipColor}
        sx={{
            fontWeight: 600,
            backgroundColor: alpha(color, 0.1),
            color: color,
        }}
      />
    );
  };
};

// --- Custom Toolbar for DataGrid ---
const CustomToolbar = ({ vm }) => {
    const theme = useTheme();

    return (
        <Toolbar
            disableGutters
            sx={{
                p: 2,
                pb: 1,
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            {/* Quick Filter Search Input */}
            <Box sx={{ flexGrow: 1, mr: 2 }}>
                <GridToolbarQuickFilter 
                    placeholder="Search invoice number or customer name..."
                    sx={{ width: '100%', minWidth: 280 }}
                />
            </Box>

            {/* Status Filter (External filter handled by vm) */}
            <TextField
                select
                label="Status Filter"
                value={vm.status}
                onChange={(e) => vm.setStatus(e.target.value)}
                sx={{ minWidth: 160, mr: 2 }}
                variant="outlined"
                size="small"
                InputProps={{ startAdornment: <SvgIcon component={InfoOutlinedIcon} fontSize="small" sx={{ mr: 0.5 }} /> }}
            >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="POSTED">Posted</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </TextField>

            {/* Default DataGrid Toolbar Buttons (Density, Export) */}
            <GridToolbar />
        </Toolbar>
    );
};

// --- Custom No Rows Overlay ---
const CustomNoRowsOverlay = () => (
    <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
        <InfoOutlinedIcon color="action" sx={{ fontSize: 40 }} />
        <Typography color="text.secondary" variant="h6">
            No Sales Invoices Found
        </Typography>
        <Typography color="text.secondary" variant="body2">
            Try adjusting your search criteria or filters.
        </Typography>
    </Stack>
);


export default function SalesInvoiceListPage() {
  const nav = useNavigate();
  const vm = useSalesInvoiceListVM();
  const theme = useTheme();
  const renderStatusChip = useStatusChip();

  // --- Actions Handler (Improved) ---
  const handlePost = (id, invoiceNo) => {
    const ok = window.confirm(`Confirm posting Sales Invoice ${invoiceNo}? This action is irreversible.`);
    if (ok) vm.post(id);
  };

  const handleCancel = (id, invoiceNo) => {
    const ok = window.confirm(`Confirm cancelling Sales Invoice ${invoiceNo}? This action is permanent.`);
    if (ok) vm.cancel(id);
  };

  // --- DataGrid Columns ---
  const columns = [
    { 
        field: "invoiceNo", 
        headerName: "Invoice No", 
        flex: 1, 
        minWidth: 130, 
        renderCell: (p) => (
            <Typography fontWeight={600} color="primary">
                {p.value}
            </Typography>
        )
    },
    { 
        field: "date", 
        headerName: "Date", 
        width: 120, 
        type: "date", 
        // FIX: Convert string date to Date object for MUI X sorting/filtering
        valueGetter: (params) => params.value ? new Date(params.value) : null,
        // Explicitly format the date for better visual control
        valueFormatter: (value) => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US");
}

    },
    { field: "customerName", headerName: "Customer", flex: 1.5, minWidth: 220 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (p) => renderStatusChip(p.value),
    },
    {
      field: "grandTotal",
      headerName: "Grand Total",
      type: 'number',
      width: 150,
      align: 'right', // Align numbers to the right
      headerAlign: 'right', // Align header to the right
      // ULTIMATE FIX: Check for null/undefined params object AND null/empty value
      valueFormatter: (params) => {
        if (!params) {
          return ''; // Handle case where params object itself is null
        }
        const value = params.value;
        
        if (value === null || value === undefined || value === "") {
          return ''; // Return an empty string for null/empty cell values
        }
        return Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (p) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View/Edit Invoice">
            <IconButton size="small" onClick={() => nav(`${p.row.id}`)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={p.row.status === "DRAFT" ? "Post Invoice (Irreversible)" : "Invoice is Posted"}>
            <span>
              <IconButton
                size="small"
                onClick={() => handlePost(p.row.id, p.row.invoiceNo)}
                disabled={p.row.status !== "DRAFT"}
                color="success"
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={p.row.status !== "CANCELLED" ? "Cancel Invoice (Permanent)" : "Invoice is Cancelled"}>
            <span>
              <IconButton
                size="small"
                onClick={() => handleCancel(p.row.id, p.row.invoiceNo)}
                disabled={p.row.status === "CANCELLED"}
                color="error"
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // --- Component Render ---
  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* 1. Header and New Button */}
      <Toolbar disableGutters sx={{ mb: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={700}>Sales Invoices</Typography>
          <Typography variant="body1" color="text.secondary">Manage customer billing and transaction history.</Typography>
        </Box>
        
        {/* Refresh Button integrated into the header stack */}
        <Tooltip title="Refresh Data">
            <IconButton 
                onClick={vm.reload} 
                disabled={vm.loading}
                sx={{
                    border: (t) => `1px solid ${t.palette.divider}`,
                    p: 1.5,
                    mr: 1.5,
                }}
            >
                {vm.loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
        </Tooltip>

       <Button
  variant="contained"
  onClick={() => nav("/sales-invoices/new")}
  startIcon={<AddIcon />}
  disableElevation
  color="success"
  sx={{ py: 1 }}
>
  New Invoice
</Button>

      </Toolbar>

      {/* 2. Data Grid Container */}
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={vm.rows}
            columns={columns}
            loading={vm.loading}
            getRowId={(r) => r.id}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            onRowDoubleClick={(p) => nav(`${p.row.id}`)}
            
            // --- Custom Toolbar and Empty State Integration ---
            slots={{ 
                toolbar: () => <CustomToolbar vm={vm} />, 
                noRowsOverlay: CustomNoRowsOverlay 
            }}
            
            sx={{ 
              borderRadius: 3, 
              // Styling for row hover consistency
              '& .MuiDataGrid-row:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  cursor: 'pointer',
              },
            }}
          />
        </div>
      </Card>
    </Box>
  );
}