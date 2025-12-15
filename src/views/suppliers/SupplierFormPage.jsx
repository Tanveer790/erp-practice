import {
  Box, Button, MenuItem, Paper, Stack, TextField, Toolbar, Typography,
  CircularProgress, Divider, useTheme, Alert, Grid 
} from "@mui/material";
import SaveIcon from "@mui/icons-material/SaveRounded";
// Ensure these paths are correct in your project:
import { SupplierStatus } from "../../models/suppliers/supplierModel"; 
import { useSupplierFormVM } from "../../viewmodels/suppliers/useSupplierFormVM"; 

/**
 * @typedef {'new' | 'edit'} FormMode
 * @param {object} props
 * @param {FormMode} props.mode
 */
export default function SupplierFormPage({ mode }) {
  const theme = useTheme();
  const vm = useSupplierFormVM({ mode }); // vm contains form, errors, save function, etc.

  // --- Render States ---
  if (vm.loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress size={30} sx={{ mr: 2 }} />
        <Typography variant="h6" color="text.secondary">Loading Supplier Data...</Typography>
      </Box>
    );
  }

  // --- Form Structure ---
  return (
    <Box>
      {/* 1. Page Header and Actions */}
      <Toolbar disableGutters sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={700}>{vm.title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {mode === 'new' ? 'Enter details for the new supplier.' : `Editing supplier master data for ${vm.form.name || '...'}.`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" onClick={vm.goBack} disabled={vm.saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={vm.save}
            disabled={vm.saving || !vm.form.name || !vm.form.code}
            startIcon={vm.saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disableElevation
            sx={{ py: 1 }}
          >
            {vm.saving ? "Saving..." : (mode === 'edit' ? "Update Supplier" : "Create Supplier")}
          </Button>
        </Stack>
      </Toolbar>

      {/* 2. Form Content Panel */}
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={4}>
          {vm.error && (
            <Alert severity="error" onClose={vm.clearError} sx={{ mb: 2 }}>
              {vm.error}
            </Alert>
          )}

          {/* Section 1: Identification */}
          <Typography variant="h6" fontWeight={600} color="primary.main">
            General Information
          </Typography>
          <Divider />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Supplier Code"
                value={vm.form.code}
                fullWidth
                required
                variant="outlined"
                // Code is read-only in edit mode
                inputProps={{ readOnly: mode === "edit" }}
                
                // DEFENSIVE FIX: vm.errors?.code prevents the TypeError
                helperText={vm.errors?.code || (mode === 'edit' ? "Code cannot be changed once created." : "Required. Unique internal identifier.")}
                error={Boolean(vm.errors?.code)}
                
                onChange={(e) => vm.setField("code", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Supplier Name"
                value={vm.form.name}
                onChange={(e) => vm.setField("name", e.target.value)}
                fullWidth
                required
                variant="outlined"
                
                // DEFENSIVE FIX
                helperText={vm.errors?.name || "Required. The full legal name of the vendor."}
                error={Boolean(vm.errors?.name)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                value={vm.form.status}
                onChange={(e) => vm.setField("status", e.target.value)}
                fullWidth
                variant="outlined"
                disabled={mode === 'new'}
                helperText={mode === 'new' ? "Status defaults to Active upon creation." : "Set the current operational status."}
              >
                <MenuItem value={SupplierStatus.ACTIVE}>Active</MenuItem>
                <MenuItem value={SupplierStatus.INACTIVE}>Inactive / Blocked</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField 
                    label="VAT Registration No." 
                    value={vm.form.vatNo} 
                    onChange={(e) => vm.setField("vatNo", e.target.value)} 
                    fullWidth 
                    variant="outlined"
                    
                    // DEFENSIVE FIX
                    helperText={vm.errors?.vatNo || "Required for tax and regulatory compliance."}
                    error={Boolean(vm.errors?.vatNo)}
                />
            </Grid>
          </Grid>

          {/* Section 2: Contact Information */}
          <Typography variant="h6" fontWeight={600} color="primary.main" sx={{ pt: 2 }}>
            Contact and Location
          </Typography>
          <Divider />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Primary Phone"
                value={vm.form.phone}
                onChange={(e) => vm.setField("phone", e.target.value)}
                fullWidth
                variant="outlined"
                type="tel"
                
                // DEFENSIVE FIX
                helperText={vm.errors?.phone || "Primary contact phone number."}
                error={Boolean(vm.errors?.phone)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Primary Email"
                value={vm.form.email}
                onChange={(e) => vm.setField("email", e.target.value)}
                fullWidth
                variant="outlined"
                type="email"
                
                // DEFENSIVE FIX
                helperText={vm.errors?.email || "Primary contact email address."}
                error={Boolean(vm.errors?.email)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Physical Address"
                value={vm.form.address}
                onChange={(e) => vm.setField("address", e.target.value)}
                fullWidth
                multiline
                minRows={3}
                variant="outlined"
                
                // DEFENSIVE FIX
                helperText={vm.errors?.address || "Main physical address for deliveries or official correspondence."}
                error={Boolean(vm.errors?.address)}
              />
            </Grid>
          </Grid>
        </Stack>
      </Paper>
    </Box>
  );
}