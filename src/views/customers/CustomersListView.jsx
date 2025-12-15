import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer, // Use TableContainer for better scrolling
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  TextField,
  Stack,
  Chip,
  Divider,
  CircularProgress, // Added for better loading state
  Tooltip, // Added for action icons
  useTheme,
  alpha,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/RefreshRounded';
import AddIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import BlockIcon from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useCustomersViewModel } from '../../viewmodels/customers/useCustomersViewModel.js'; // Ensure path is correct
import { CustomerFormDialog } from './CustomerFormDialog.jsx'; // Ensure path is correct

// Define Table Headers for clarity
const TABLE_HEADS = [
  'ID',
  'Name',
  'Contact Info',
  'Location',
  'Status',
  'Actions',
];


export default function CustomersListView() {
  const theme = useTheme();
  const { customers, loading, error, reload, addCustomer, updateCustomer, deactivateCustomer } =
    useCustomersViewModel();


  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // --- Filtering Logic (kept as is, but memoized) ---
  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;

    return customers.filter((c) => {
      return (
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term) ||
        c.city?.toLowerCase().includes(term)
      );
    });
  }, [customers, search]);

  // --- Handlers ---
  const openAdd = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  const openEdit = (customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleSave = (values) => {
    if (selectedCustomer?.id) {
      updateCustomer(selectedCustomer.id, values);
    } else {
      addCustomer(values);
    }
    setDialogOpen(false);
  };

  const handleDeactivate = (id) => {
    if (window.confirm("Are you sure you want to deactivate this customer?")) {
        deactivateCustomer(id);
    }
  };


  // --- Render Functions ---

  const renderStatusChip = (isActive) => (
    <Chip
      label={isActive ? 'Active' : 'Inactive'}
      size="small"
      icon={isActive ? <CheckCircleRoundedIcon fontSize="small" /> : <CancelRoundedIcon fontSize="small" />}
      color={isActive ? 'success' : 'default'}
      variant={isActive ? 'filled' : 'outlined'}
      sx={{ 
        fontWeight: 600, 
        backgroundColor: isActive 
            ? alpha(theme.palette.success.main, 0.1) 
            : alpha(theme.palette.grey[500], 0.1),
        color: isActive ? theme.palette.success.dark : theme.palette.text.secondary
      }}
    />
  );
  
  const renderActions = (customer) => (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip title="Edit Customer Details">
        <IconButton size="small" onClick={() => openEdit(customer)} color="primary">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={customer.isActive ? "Deactivate Customer" : "Customer is already inactive"}>
        <IconButton
          size="small"
          onClick={() => handleDeactivate(customer.id)}
          disabled={!customer.isActive}
          color="error"
        >
          <BlockIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Customer Master
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your Tan-ERP customer master data and contact information.
        </Typography>
      </Box>

      <Paper
        elevation={4} // Increased elevation for depth
        sx={{
          borderRadius: 3, // More rounded corners
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }}
      >
        {/* TOP TOOLBAR: Actions & Search */}
        <Toolbar
          sx={{
            px: 3, // Increased padding
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 64,
          }}
        >
          {/* Left Side: Title and Count */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Customer List
            </Typography>
            <Chip
              label={`${customers.length} total`}
              size="medium" // Slightly larger chip
              color="info"
              variant="soft" // Use 'soft' variant if available in your theme, otherwise 'outlined'
            />
          </Stack>

          {/* Right Side: Search and Buttons */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            {/* Search Input (Replaced TextField with a cleaner Box wrapper) */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: theme.palette.grey[100],
                px: 2,
                py: 0.8,
                borderRadius: 999,
                width: 350,
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
                placeholder="Search by name, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '0.9rem' }
                }}
                size="small"
              />
            </Box>

            {/* Refresh Button */}
            <Tooltip title="Reload Data">
              <span>
                <IconButton
                  onClick={reload}
                  disabled={loading}
                  sx={{
                    borderRadius: 1.5,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : <RefreshIcon fontSize="small" />}
                </IconButton>
              </span>
            </Tooltip>

            {/* Add Button */}
            <Button
              startIcon={<AddIcon />}
              onClick={openAdd}
              variant="contained"
              disableElevation
              sx={{ py: 1 }}
            >
              New Customer
            </Button>
          </Stack>
        </Toolbar>

        <Divider />

        {/* Table area */}
        <TableContainer sx={{ maxHeight: 600 }}> {/* Added max height for vertical scroll */}
          <Table stickyHeader size="medium"> {/* Sticky header for better UX on long lists */}
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: theme.palette.grey[50], fontWeight: 700 } }}>
                {TABLE_HEADS.map((head) => (
                    <TableCell key={head} align={head === 'Actions' ? 'right' : 'left'}>
                        {head}
                    </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADS.length} sx={{ textAlign: 'center', py: 5 }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      Loading customer data...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADS.length} sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="body1" color="error">
                      Error fetching data: {error}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredCustomers.map((c, index) => (
                <TableRow
                  key={c.id ?? index}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&.MuiTableRow-hover:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }}
                >
                  <TableCell sx={{ width: 60, fontWeight: 600 }}>{c.id || index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{c.name}</TableCell>
                  <TableCell>
                    <Stack>
                        <Typography variant="body2">{c.phone}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell>{renderStatusChip(c.isActive)}</TableCell>
                  <TableCell align="right">
                    {renderActions(c)}
                  </TableCell>
                </TableRow>
              ))}

              {!loading && !error && filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADS.length}>
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>
                        No customers found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Try adjusting your search or click 'New Customer' to add one.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>

      {/* Customer Form Dialog */}
      <CustomerFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
        initialValues={selectedCustomer}
        isEditing={!!selectedCustomer} // Pass a prop to indicate edit mode
      />
    </Box>
  );
}