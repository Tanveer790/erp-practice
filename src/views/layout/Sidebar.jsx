import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { appConfig } from "../../core/config.js";

const drawerWidth = 200;

const navItems = [
  { label: "Dashboard", to: "/", end: true }, 
  { label: "Customers", to: "/customers" },
  { label: "Sales Invoices", to: "/sales-invoices" },
  { label: "Items", to: "/items" },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          {appConfig.appName}
        </Typography>
      </Toolbar>

      <Box sx={{ overflow: "auto" }}>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.end}   
              sx={{
                "&.active": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
