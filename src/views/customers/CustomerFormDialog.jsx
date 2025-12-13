import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useState, useEffect } from 'react';

export function CustomerFormDialog({ open, onClose, onSubmit, initialValues }) {
  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    setValues({
      name: initialValues?.name ?? '',
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? '',
      city: initialValues?.city ?? '',
      isActive: initialValues?.isActive ?? true,
    });
    setErrors({});
  }, [open, initialValues]);

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = 'Name is required';
    if (!values.phone.trim()) newErrors.phone = 'Phone is required';
    if (!values.email.trim()) newErrors.email = 'Email is required';
    if (!values.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(values);
  };

  const isEdit = Boolean(initialValues?.id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Customer Name"
            value={values.name}
            onChange={handleChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Phone"
            value={values.phone}
            onChange={handleChange('phone')}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
            fullWidth
          />
          <TextField
            label="Email"
            value={values.email}
            onChange={handleChange('email')}
            error={Boolean(errors.email)}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            label="City"
            value={values.city}
            onChange={handleChange('city')}
            error={Boolean(errors.city)}
            helperText={errors.city}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={values.isActive}
                onChange={(e) =>
                  setValues((p) => ({ ...p, isActive: e.target.checked }))
                }
              />
            }
            label={values.isActive ? 'Active' : 'Inactive'}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{isEdit ? 'Update' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}
