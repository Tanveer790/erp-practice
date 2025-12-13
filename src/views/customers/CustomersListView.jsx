import { useState, useMemo } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  TextField,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useCustomersViewModel } from '../../viewmodels/customers/useCustomersViewModel.js';
import { CustomerFormDialog } from './CustomerFormDialog.jsx';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';



export default function CustomersListView() {
  const { customers, loading, error, reload, addCustomer, updateCustomer, deactivateCustomer } =
  useCustomersViewModel();


  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleAddCustomer = (values) => {
    addCustomer(values);
    setDialogOpen(false);
  };

  const [selectedCustomer, setSelectedCustomer] = useState(null);

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


  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Customers
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your Tan-ERP customer master data.
        </Typography>
      </Box>

      <Paper
        elevation={1}
        sx={{
          mt: 1,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Top toolbar inside card */}
        <Toolbar
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle1" fontWeight={600}>
              Customer List
            </Typography>
            <Chip
              label={`${customers.length} total`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ minWidth: 0, flexShrink: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'background.default',
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                width: 320,
              }}
            >
              <SearchIcon fontSize="small" />
              <TextField
                variant="standard"
                placeholder="Search by name, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                InputProps={{
                  disableUnderline: true,
                }}
                size="small"
              />
            </Box>

            <IconButton
              onClick={reload}
              disabled={loading}
              sx={{
                borderRadius: 1.5,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>

            <Button
  startIcon={<AddIcon />}
  onClick={openAdd}
>
  New Customer
</Button>

          </Stack>
        </Toolbar>

        <Divider />

        {/* Table area */}
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCustomers.map((c, index) => (
                <TableRow
                  key={c.id ?? index}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                  
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell>{c.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Chip
                      label={c.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={c.isActive ? 'success' : 'default'}
                      variant={c.isActive ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="right">
    <IconButton size="small" onClick={() => openEdit(c)}>
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton
      size="small"
      onClick={() => deactivateCustomer(c.id)}
      disabled={!c.isActive}
    >
      <BlockIcon fontSize="small" />
    </IconButton>
  </TableCell>
                </TableRow>
                
              ))}

              {!loading && filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body1" fontWeight={500}>
                        No customers found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Try adjusting your search or add a new customer.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        {(loading || error) && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {loading && (
              <Typography variant="body2" color="text.secondary">
                Loading customers...
              </Typography>
            )}
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      {/* Add Customer Dialog */}
      <CustomerFormDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  onSubmit={handleSave}
  initialValues={selectedCustomer}
/>

    </Box>
  );
}
