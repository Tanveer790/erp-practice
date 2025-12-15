import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { appConfig } from "../../core/config.js";

// Import Icons
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import PeopleIcon from "@mui/icons-material/PeopleAltRounded";
import InventoryIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptIcon from "@mui/icons-material/ReceiptLongRounded";
import LocalShippingIcon from "@mui/icons-material/LocalShippingRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartRounded";
import LogoDevIcon from '@mui/icons-material/LogoDev'; // Example Logo Icon

const drawerWidth = 260; // Slightly wider for a modern feel

// Enhanced data structure with Icons
const navItems = [
  { label: "Dashboard", to: "/", icon: <DashboardIcon />, end: true },
  { label: "Customers", to: "/customers", icon: <PeopleIcon /> },
  { label: "Suppliers", to: "/suppliers", icon: <LocalShippingIcon /> },
  { label: "Sales Invoices", to: "/sales-invoices", icon: <ReceiptIcon /> },
  { label: "Purchase Invoices", to: "/purchase-invoices", icon: <ShoppingCartIcon /> },
  { label: "Items", to: "/items", icon: <InventoryIcon /> },
];

export default function Sidebar() {
  const theme = useTheme();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default, // Use theme background
        },
      }}
    >
      {/* --- Brand / Logo Section --- */}
      <Toolbar sx={{ px: 2, minHeight: 80, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          variant="rounded" 
          sx={{ 
            bgcolor: theme.palette.primary.main, 
            width: 40, 
            height: 40 
          }}
        >
          <LogoDevIcon /> 
        </Avatar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            color: theme.palette.text.primary,
            letterSpacing: '-0.5px' 
          }}
        >
          {appConfig.appName}
        </Typography>
      </Toolbar>

      {/* --- Navigation List --- */}
      <Box sx={{ overflow: "auto", px: 2, py: 2 }}>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.end}
              sx={{
                borderRadius: "12px", // Rounded corners ("Pill" shape)
                mb: 1, // Margin bottom for spacing between items
                minHeight: 48,
                transition: "all 0.2s ease-in-out",
                color: theme.palette.text.secondary,
                
                // Hover State
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },

                // Active State (Handled by NavLink's "active" class)
                "&.active": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main, // Text becomes primary color
                  fontWeight: "bold",
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main, // Icon becomes primary color
                  },
                  "& .MuiTypography-root": {
                    fontWeight: 600, // Make text bold when active
                  }
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: "inherit", // Inherit color from parent (handles hover/active)
                }}
              >
                {item.icon}
              </ListItemIcon>
              
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontSize: '0.95rem',
                  fontWeight: 'medium' 
                }} 
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Optional: Footer section (e.g., User Profile or Logout) */}
      <Box sx={{ mt: 'auto', p: 2 }}>
         <Divider sx={{ mb: 2 }} />
         <Typography variant="caption" color="text.secondary" align="center" display="block">
            v1.0.0 © 2024
         </Typography>
      </Box>
    </Drawer>
  );
}