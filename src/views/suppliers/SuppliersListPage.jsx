import {
  Box, Button, Chip, IconButton, MenuItem, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography,
  CircularProgress, Tooltip, useTheme, alpha // Added for visual polish
} from "@mui/material";
import AddIcon from "@mui/icons-material/AddRounded"; // Rounded icons
import RefreshIcon from "@mui/icons-material/RefreshRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import BlockIcon from "@mui/icons-material/BlockRounded";
import SearchIcon from "@mui/icons-material/SearchRounded"; // Added search icon
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useNavigate } from "react-router-dom";
import { useSuppliersListVM } from "../../viewmodels/suppliers/useSuppliersListVM"; // Ensure path is correct
import suppliersRepo from "../../models/suppliers/suppliersRepo"; // Ensure path is correct
import { SupplierStatus } from "../../models/suppliers/supplierModel"; // Ensure path is correct

// Table Headings
const TABLE_HEADS = [
  { label: "Code", align: "left" },
  { label: "Name", align: "left" },
  { label: "Phone & Email", align: "left" }, // Combined contact info
  { label: "VAT No.", align: "left" },
  { label: "Status", align: "center" },
  { label: "Actions", align: "right" },
];

export default function SuppliersListPage() {
  const theme = useTheme();
  const vm = useSuppliersListVM();
  const nav = useNavigate();

  const deactivate = (row) => {
    if (!row?.id || row.status === SupplierStatus.INACTIVE) return;
    const ok = window.confirm(`Are you sure you want to deactivate supplier "${row.code} - ${row.name}"? This action cannot be easily undone.`);
    if (!ok) return;

    // Use a loading state here if the ViewModel provided one, but we'll simulate the action directly.
    suppliersRepo.update(row.id, { status: SupplierStatus.INACTIVE })
      .then(() => vm.reload())
      .catch((err) => alert(`Failed to deactivate supplier: ${err.message}`));
  };

  // --- Render Functions ---

  const renderStatusChip = (status) => {
    const isActive = status === SupplierStatus.ACTIVE;
    const color = isActive ? 'success' : 'default';

    return (
      <Chip
        size="small"
        label={status || "N/A"}
        icon={isActive ? <CheckCircleRoundedIcon fontSize="small" /> : <CancelRoundedIcon fontSize="small" />}
        color={color}
        sx={{
          fontWeight: 600,
          backgroundColor: isActive
            ? alpha(theme.palette.success.main, 0.1)
            : alpha(theme.palette.grey[500], 0.1),
          color: isActive ? theme.palette.success.dark : theme.palette.text.secondary
        }}
      />
    );
  };


  return (
    <Box>
      {/* Page Header and Main Actions */}
      <Toolbar disableGutters sx={{ mb: 3 }}> {/* Increased bottom margin */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={700}>Suppliers Master</Typography> {/* Larger heading */}
          <Typography variant="body1" color="text.secondary">Manage vendor and supplier master data.</Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Reload Button with loading indicator */}
            <Tooltip title="Reload Data">
              <span>
                <IconButton
                  onClick={vm.reload}
                  disabled={vm.loading}
                  sx={{
                    borderRadius: 1.5,
                    border: (t) => `1px solid ${t.palette.divider}`,
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
                  }}
                >
                  {vm.loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                </IconButton>
              </span>
            </Tooltip>

            {/* New Supplier Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => nav("/suppliers/new")}
              disableElevation
              sx={{ py: 1 }}
            >
              New Supplier
            </Button>
        </Stack>
      </Toolbar>

      {/* --- Filter and Search Panel --- */}
      <Paper elevation={4} sx={{ p: 3, mb: 3, borderRadius: 3 }}> {/* Increased elevation and padding */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          
          {/* Search Field */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: theme.palette.grey[100],
              px: 2,
              py: 0.8,
              borderRadius: 999,
              width: { xs: '100%', md: 400 },
              border: '1px solid transparent',
              '&:focus-within': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'background.paper',
              }
            }}
          >
            <SearchIcon fontSize="small" color="action" />
            <TextField
              variant="standard"
              placeholder="Search by code, name, or VAT..."
              value={vm.q}
              onChange={(e) => vm.setQ(e.target.value)}
              fullWidth
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: '0.9rem' }
              }}
              size="small"
            />
          </Box>
          
          {/* Status Filter */}
          <TextField
            select
            label="Filter by Status"
            value={vm.status}
            onChange={(e) => vm.setStatus(e.target.value)}
            sx={{ minWidth: 200, width: { xs: '100%', md: 'auto' } }}
            variant="outlined"
            size="small"
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value={SupplierStatus.ACTIVE}>Active</MenuItem>
            <MenuItem value={SupplierStatus.INACTIVE}>Inactive</MenuItem>
          </TextField>

          <Chip 
              label={`${vm.rows.length} suppliers shown`} 
              size="medium" 
              color="info" 
              sx={{ ml: { xs: 0, md: 'auto' } }}
          />

        </Stack>
      </Paper>

      {/* --- Data Table --- */}
      <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow sx={{ '& th': { backgroundColor: theme.palette.grey[50], fontWeight: 700 } }}>
              {TABLE_HEADS.map((head) => (
                <TableCell key={head.label} align={head.align}>
                  {head.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Loading State */}
            {vm.loading && (
              <TableRow>
                <TableCell colSpan={TABLE_HEADS.length} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    Fetching supplier data...
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Data Rows */}
            {!vm.loading && vm.rows.map((r) => (
              <TableRow
                key={r.id}
                hover
                sx={{
                    '&.MuiTableRow-hover:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) }
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{r.code}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{r.name}</TableCell>
                <TableCell>
                    <Stack>
                        <Typography variant="body2">{r.phone}</Typography>
                        <Typography variant="caption" color="text.secondary">{r.email}</Typography>
                    </Stack>
                </TableCell>
                <TableCell>{r.vatNo}</TableCell>
                <TableCell align="center">
                  {renderStatusChip(r.status)}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Edit Supplier Details">
                        <IconButton size="small" onClick={() => nav(`/suppliers/${r.id}/edit`)} color="primary">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={r.status === SupplierStatus.ACTIVE ? "Deactivate Supplier" : "Supplier is Inactive"}>
                        <span> {/* Span needed to show tooltip when disabled */}
                            <IconButton
                                size="small"
                                onClick={() => deactivate(r)}
                                disabled={r.status === SupplierStatus.INACTIVE}
                                color="error"
                            >
                                <BlockIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {/* No Data State */}
            {!vm.loading && vm.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_HEADS.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No suppliers found matching the current filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}