import { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";

import { useItemsListVM } from "../../viewmodels/items/useItemsListVM";
import itemsRepo from "../../models/items/itemsRepo";
import { ItemStatus } from "../../models/items/itemsModel";

export default function ItemsListPage() {
  const vm = useItemsListVM();
  const navigate = useNavigate();

  const statusLabel = useMemo(
    () => ({
      [ItemStatus.ACTIVE]: "Active",
      [ItemStatus.INACTIVE]: "Inactive",
    }),
    []
  );

  const onDeactivate = (row) => {
    if (!row?.id || row.status === ItemStatus.INACTIVE) return;

    const ok = window.confirm(`Deactivate item "${row.code} - ${row.name}"?`);
    if (!ok) return;

    itemsRepo.update(row.id, { status: ItemStatus.INACTIVE });
    vm.reload();
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            Items
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Product / Item master
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton onClick={vm.reload}>
            <RefreshIcon />
          </IconButton>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/items/new")}
          >
            New Item
          </Button>
        </Stack>
      </Toolbar>

      {/* Filters */}
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
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value={ItemStatus.ACTIVE}>Active</MenuItem>
            <MenuItem value={ItemStatus.INACTIVE}>Inactive</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>UOM</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Tax %</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vm.loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : vm.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No items found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              vm.rows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{r.code}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.uom}</TableCell>

                  <TableCell align="right">
                    {Number(r.price || 0).toFixed(2)}
                  </TableCell>

                  <TableCell align="right">
                    {Number(r.taxRate ?? 0).toFixed(2)}
                  </TableCell>

                  <TableCell align="right">
                    {Number(r.stockQty || 0).toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={statusLabel[r.status] ?? r.status ?? "-"}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/items/${r.id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      disabled={r.status === ItemStatus.INACTIVE}
                      onClick={() => onDeactivate(r)}
                    >
                      <BlockIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
