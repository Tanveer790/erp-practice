import {
  Box, Button, Chip, IconButton, MenuItem, Paper, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { useSuppliersListVM } from "../../viewmodels/suppliers/useSuppliersListVM";
import suppliersRepo from "../../models/suppliers/suppliersRepo";
import { SupplierStatus } from "../../models/suppliers/supplierModel";

export default function SuppliersListPage() {
  const vm = useSuppliersListVM();
  const nav = useNavigate();

  const deactivate = (row) => {
    if (!row?.id || row.status === SupplierStatus.INACTIVE) return;
    const ok = window.confirm(`Deactivate supplier "${row.code} - ${row.name}"?`);
    if (!ok) return;
    suppliersRepo.update(row.id, { status: SupplierStatus.INACTIVE });
    vm.reload();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>Suppliers</Typography>
          <Typography variant="body2" color="text.secondary">Supplier master data</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={vm.reload}><RefreshIcon /></IconButton>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => nav("/suppliers/new")}>
            New Supplier
          </Button>
        </Stack>
      </Toolbar>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Search (Code / Name)"
            value={vm.q}
            onChange={(e) => vm.setQ(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={vm.status}
            onChange={(e) => vm.setStatus(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value={SupplierStatus.ACTIVE}>Active</MenuItem>
            <MenuItem value={SupplierStatus.INACTIVE}>Inactive</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>VAT</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vm.rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{r.code}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell>{r.vatNo}</TableCell>
                <TableCell>
                  <Chip size="small" variant="outlined" label={r.status || "-"} />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => nav(`/suppliers/${r.id}/edit`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deactivate(r)}
                    disabled={r.status === SupplierStatus.INACTIVE}
                  >
                    <BlockIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {!vm.loading && vm.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No suppliers</Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
