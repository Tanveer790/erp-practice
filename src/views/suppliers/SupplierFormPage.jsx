import {
  Box, Button, MenuItem, Paper, Stack, TextField, Toolbar, Typography
} from "@mui/material";
import { SupplierStatus } from "../../models/suppliers/supplierModel";
import { useSupplierFormVM } from "../../viewmodels/suppliers/useSupplierFormVM";

export default function SupplierFormPage({ mode }) {
  const vm = useSupplierFormVM({ mode });

  if (vm.loading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>{vm.title}</Typography>
          <Typography variant="body2" color="text.secondary">Supplier details</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={vm.goBack}>Cancel</Button>
          <Button variant="contained" onClick={vm.save} disabled={vm.saving}>
            {vm.saving ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Toolbar>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          {vm.error ? <Typography color="error">{vm.error}</Typography> : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Code" value={vm.form.code} fullWidth inputProps={{ readOnly: mode !== "edit" }} />
            <TextField
              select
              label="Status"
              value={vm.form.status}
              onChange={(e) => vm.setField("status", e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value={SupplierStatus.ACTIVE}>Active</MenuItem>
              <MenuItem value={SupplierStatus.INACTIVE}>Inactive</MenuItem>
            </TextField>
          </Stack>

          <TextField label="Name" value={vm.form.name} onChange={(e) => vm.setField("name", e.target.value)} fullWidth />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Phone" value={vm.form.phone} onChange={(e) => vm.setField("phone", e.target.value)} fullWidth />
            <TextField label="Email" value={vm.form.email} onChange={(e) => vm.setField("email", e.target.value)} fullWidth />
          </Stack>
          <TextField label="VAT No" value={vm.form.vatNo} onChange={(e) => vm.setField("vatNo", e.target.value)} fullWidth />
          <TextField label="Address" value={vm.form.address} onChange={(e) => vm.setField("address", e.target.value)} fullWidth multiline minRows={2} />
        </Stack>
      </Paper>
    </Box>
  );
}
