import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { createEmptyItem, ItemStatus } from "../../models/items/itemsModel";
import itemsRepo from "../../models/items/itemsRepo";


export default function ItemFormPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = mode === "edit";
  const title = useMemo(() => (isEdit ? "Edit Item" : "New Item"), [isEdit]);

  const [form, setForm] = useState(createEmptyItem());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const row = itemsRepo.getById(id);
    if (!row) {
      setError("Item not found");
      return;
    }
    setForm(row);
  }, [isEdit, id]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    if (!String(form.code || "").trim()) return "Item code is required";
    if (!String(form.name || "").trim()) return "Item name is required";
    if (Number(form.price || 0) < 0) return "Price cannot be negative";
    if (Number(form.taxRate ?? 0) < 0) return "Tax rate cannot be negative";
    return "";
  };

  const onSave = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");

    const payload = {
      ...form,
      code: String(form.code || "").trim(),
      name: String(form.name || "").trim(),
      uom: String(form.uom || "PCS").trim(),
      price: Number(form.price || 0),
      taxRate: Number(form.taxRate ?? 0),
      updatedAt: new Date().toISOString(),
    };

    if (isEdit) {
      itemsRepo.update(form.id, payload);
    } else {
      itemsRepo.create(payload);
    }
    navigate("/items");
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and maintain item master
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate("/items")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSave}>
            Save
          </Button>
        </Stack>
      </Toolbar>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          {error ? (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          ) : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Code"
              value={form.code}
              onChange={(e) => setField("code", e.target.value)}
              fullWidth
            />
            <TextField
              label="UOM"
              value={form.uom}
              onChange={(e) => setField("uom", e.target.value)}
              sx={{ minWidth: 140 }}
            />
          </Stack>

          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            fullWidth
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              fullWidth
            />
            <TextField
              label="Tax Rate %"
              type="number"
              value={form.taxRate}
              onChange={(e) => setField("taxRate", e.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value={ItemStatus.ACTIVE}>Active</MenuItem>
              <MenuItem value={ItemStatus.INACTIVE}>Inactive</MenuItem>
            </TextField>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
