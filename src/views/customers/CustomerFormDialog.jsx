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
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';
import SaveIcon from '@mui/icons-material/SaveRounded';
import UpdateIcon from '@mui/icons-material/UpdateRounded';

// Props Interface for clarity (optional, but good practice)
/**
 * @typedef {object} CustomerValues
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {string} city
 * @property {boolean} isActive
 * @property {string | number} [id] - Optional ID for editing
 */

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {(values: CustomerValues) => void} props.onSubmit
 * @param {CustomerValues | null} props.initialValues
 */
export function CustomerFormDialog({ open, onClose, onSubmit, initialValues }) {
  const theme = useTheme();

  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const isEdit = Boolean(initialValues?.id);

  // Effect to load initial values when the dialog opens
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

  // --- Handlers ---
  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error immediately when user starts typing/changing
    if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!values.name.trim()) newErrors.name = 'Customer Name is required.';
    // Simple email validation (can be enhanced later with regex)
    if (!values.email.trim() || !values.email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!values.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!values.city.trim()) newErrors.city = 'City is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle 
        sx={{ fontWeight: 700, borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        {isEdit ? `Edit Customer: ${initialValues?.name}` : 'Register New Customer'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}> {/* Increased spacing for better look */}
          
          <TextField
            label="Customer Name"
            value={values.name}
            onChange={handleChange('name')}
            error={Boolean(errors.name)}
            helperText={errors.name || 'Enter the full legal name of the customer.'}
            fullWidth
            required
            variant="outlined" // Professional variant
            autoFocus 
          />
          
          <TextField
            label="Phone"
            value={values.phone}
            onChange={handleChange('phone')}
            error={Boolean(errors.phone)}
            helperText={errors.phone || 'Enter primary contact phone number.'}
            fullWidth
            required
            variant="outlined"
            type="tel"
          />
          
          <TextField
            label="Email"
            value={values.email}
            onChange={handleChange('email')}
            error={Boolean(errors.email)}
            helperText={errors.email || 'Enter primary contact email address.'}
            fullWidth
            required
            variant="outlined"
            type="email"
          />
          
          <TextField
            label="City / Location"
            value={values.city}
            onChange={handleChange('city')}
            error={Boolean(errors.city)}
            helperText={errors.city || 'Enter the primary city of operation.'}
            fullWidth
            required
            variant="outlined"
          />

          {/* Status Switch (Only show in edit mode, as new customers should be active) */}
          {isEdit && (
            <FormControlLabel
                control={
                    <Switch
                        checked={values.isActive}
                        onChange={handleChange('isActive')}
                        color="success" // Use a distinct color
                    />
                }
                label={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <span style={{ fontWeight: 600 }}>Status:</span>
                        <span style={{ color: values.isActive ? theme.palette.success.main : theme.palette.error.main }}>
                            {values.isActive ? 'Active Customer' : 'Inactive / Blocked'}
                        </span>
                    </Stack>
                }
                sx={{ mt: 2 }}
            />
          )}
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          startIcon={isEdit ? <UpdateIcon /> : <SaveIcon />}
          disableElevation
        >
          {isEdit ? 'Update Customer' : 'Save Customer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}