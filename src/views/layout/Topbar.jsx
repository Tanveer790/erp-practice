import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Tooltip,
  InputBase,
  Badge,
  Stack,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  NotificationsNoneRounded as NotificationsIcon,
  SettingsOutlined as SettingsIcon,
  LogoutRounded as LogoutIcon,
  Menu as MenuIcon, // Useful if you add mobile toggle later
} from "@mui/icons-material";
import { useAuthContext } from "../../core/AuthContext.jsx";

const drawerWidth = 260; // Must match your Sidebar width

export default function Topbar() {
  const { user, logout } = useAuthContext();
  const theme = useTheme();

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` }, // Calculate width to sit next to sidebar
        ml: { sm: `${drawerWidth}px` }, // Push it to the right
        backgroundColor: alpha(theme.palette.background.default, 0.8), // Translucent background
        backdropFilter: "blur(12px)", // Frosted glass effect
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 70 }}>
        
        {/* --- Left Section: Welcome & Context --- */}
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
            sx={{ display: { xs: "none", md: "block" } }} // Hide on mobile
          >
            Overview
          </Typography>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Welcome, {user?.name?.split(" ")[0] || "User"} 👋
          </Typography>
        </Box>

        {/* --- Center Section: Search Bar (Optional but Modern) --- */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            backgroundColor: alpha(theme.palette.common.black, 0.04), // Very subtle grey
            borderRadius: "12px",
            px: 2,
            py: 0.5,
            width: "300px",
            transition: "all 0.2s",
            border: `1px solid transparent`,
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.black, 0.06),
              border: `1px solid ${theme.palette.divider}`,
            },
            "&:focus-within": {
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.primary.main}`,
              boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
          }}
        >
          <SearchIcon sx={{ color: "text.disabled", mr: 1 }} />
          <InputBase
            placeholder="Search..."
            sx={{ width: "100%", fontSize: "0.9rem" }}
          />
        </Box>

        {/* --- Right Section: Actions & Profile --- */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          
          {/* Quick Actions */}
          <Tooltip title="Notifications">
            <IconButton sx={{ color: "text.secondary" }}>
              <Badge badgeContent={3} color="error" variant="dot">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton sx={{ color: "text.secondary" }}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Divider to separate Icons from Profile */}
          <Divider orientation="vertical" flexItem variant="middle" sx={{ mx: 1, height: 24, alignSelf: "center" }} />

          {/* User Profile */}
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                width: 38,
                height: 38,
                fontSize: 16,
                fontWeight: 700,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {userInitial}
            </Avatar>

            <Tooltip title="Logout">
              <IconButton
                onClick={logout}
                size="small"
                sx={{
                  color: "text.secondary",
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    color: "error.main",
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                    borderColor: "error.main",
                  },
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

      </Toolbar>
    </AppBar>
  );
}