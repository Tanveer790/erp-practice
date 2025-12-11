import { Grid, Paper, Typography, Box } from '@mui/material';

export default function DashboardView() {
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview of Tan-ERP business insights.
        </Typography>
      </Box>

      {/* Cards */}
      <Grid container spacing={2}>
        
        {/* Total Customers */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Total Customers
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              120
            </Typography>
          </Paper>
        </Grid>

        {/* Weekly Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Weekly Sales
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              SAR 18,500
            </Typography>
          </Paper>
        </Grid>

        {/* Monthly Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Monthly Sales
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              SAR 85,000
            </Typography>
          </Paper>
        </Grid>

        {/* Yearly Sales */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Yearly Sales
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              SAR 1,020,000
            </Typography>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
