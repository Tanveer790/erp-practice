import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import {
  GroupsRounded as CustomersIcon,
  AttachMoneyRounded as MoneyIcon,
  ShoppingCartRounded as CartIcon,
  TrendingUpRounded as TrendIcon,
  ReceiptLongRounded as InvoiceIcon,
  CalendarMonthRounded as CalendarIcon,
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// --- Component: Statistic Card ---
const StatisticCard = ({ title, value, icon, iconColor, trend, trendColor }) => (
  <Paper
    elevation={4} // Increased elevation for a more floating, modern look
    sx={{
      p: 3,
      borderRadius: 3, // More rounded corners
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 120,
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
        {title}
      </Typography>
      <Box
        sx={{
          p: 1,
          borderRadius: '50%',
          bgcolor: alpha(iconColor, 0.15), // Light background circle for the icon
          color: iconColor,
        }}
      >
        {icon}
      </Box>
    </Box>
    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
      {value}
    </Typography>
    <Typography variant="caption" sx={{ color: trendColor, display: 'flex', alignItems: 'center' }}>
      <TrendIcon sx={{ fontSize: 16, mr: 0.5 }} /> {trend}
    </Typography>
  </Paper>
);

// --- Dummy Data for Charts ---
const monthlySalesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Monthly Sales (SAR)',
      data: [30000, 45000, 62000, 85000, 78000, 95000, 102000],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: alpha('rgb(75, 192, 192)', 0.5),
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
    },
  ],
};

const topItemsData = {
    labels: ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'],
    datasets: [
        {
            label: 'Quantity Sold',
            data: [150, 120, 90, 80, 70],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
            ],
            borderColor: 'transparent',
            borderWidth: 1,
        },
    ],
};


// --- Dummy Data for Recent Activity ---
const recentActivity = [
    { type: 'Sales Invoice', details: 'Invoice #452 issued to Al-Hassan Trading.', date: '3 min ago', color: 'success.main' },
    { type: 'New Customer', details: 'New customer profile created for Gulf Logistics.', date: '1 hr ago', color: 'info.main' },
    { type: 'Purchase Order', details: 'Order #PO-105 placed with Supplier X.', date: 'Yesterday', color: 'warning.main' },
    { type: 'Item Update', details: 'Stock level updated for Item #203 (Laptops).', date: 'Yesterday', color: 'primary.main' },
];


export default function DashboardView() {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          👋 Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time insights for Tan-ERP operations.
        </Typography>
      </Box>

      {/* --- 1. Key Statistic Cards (KSCs) --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatisticCard
            title="Total Customers"
            value="120"
            icon={<CustomersIcon />}
            iconColor={theme.palette.info.main}
            trend="+5% from last month"
            trendColor={theme.palette.success.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatisticCard
            title="Weekly Sales"
            value="SAR 18,500"
            icon={<MoneyIcon />}
            iconColor={theme.palette.success.main}
            trend="+12% from last week"
            trendColor={theme.palette.success.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatisticCard
            title="Monthly Revenue"
            value="SAR 85,000"
            icon={<CartIcon />}
            iconColor={theme.palette.warning.main}
            trend="-3% from last month"
            trendColor={theme.palette.error.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatisticCard
            title="Total Invoices Due"
            value="SAR 15,200"
            icon={<InvoiceIcon />}
            iconColor={theme.palette.error.main}
            trend="12 outstanding"
            trendColor={theme.palette.error.main}
          />
        </Grid>
      </Grid>

      {/* --- 2. Charts and Activity (Main Content) --- */}
      <Grid container spacing={3}>
        
        {/* Sales Trend Chart (Large Area) */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Monthly Sales Performance
            </Typography>
            <Box sx={{ height: 350 }}>
              <Line data={monthlySalesData} options={{ maintainAspectRatio: false, responsive: true }} />
            </Box>
            
          </Paper>
        </Grid>
        
        {/* Recent Activity Feed (Sidebar Area) */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Recent Activity
            </Typography>
            <Stack divider={<Divider />} spacing={2}>
              {recentActivity.map((activity, index) => (
                <Box key={index} display="flex" alignItems="flex-start" gap={2}>
                    <CalendarIcon sx={{ color: activity.color, mt: 0.5 }} />
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600} color={activity.color}>
                            {activity.type}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            {activity.details}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {activity.date}
                        </Typography>
                    </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Top Selling Items Chart */}
        <Grid item xs={12} lg={6}>
            <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Top 5 Selling Items (Units)
                </Typography>
                <Box sx={{ height: 300 }}>
                    <Bar data={topItemsData} options={{ maintainAspectRatio: false, responsive: true }} />
                </Box>
                
            </Paper>
        </Grid>

        {/* Quick Links/Action Panel */}
        <Grid item xs={12} lg={6}>
             <Paper elevation={4} sx={{ p: 3, borderRadius: 3, minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { borderColor: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                            <InvoiceIcon color="primary" />
                            <Typography variant="body1">New Sales</Typography>
                        </Paper>
                    </Grid>
                     <Grid item xs={6}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { borderColor: theme.palette.warning.main, bgcolor: alpha(theme.palette.warning.main, 0.05) } }}>
                            <CartIcon color="warning" />
                            <Typography variant="body1">New Purchase</Typography>
                        </Paper>
                    </Grid>
                     <Grid item xs={6}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { borderColor: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.05) } }}>
                            <CustomersIcon color="info" />
                            <Typography variant="body1">Add Customer</Typography>
                        </Paper>
                    </Grid>
                     <Grid item xs={6}>
                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { borderColor: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.05) } }}>
                            <MoneyIcon color="error" />
                            <Typography variant="body1">View Payables</Typography>
                        </Paper>
                    </Grid>
                </Grid>
             </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}