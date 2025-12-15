// src/layouts/MainLayout.jsx

import React from "react";
import { Box, Toolbar, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Ensure correct path
import Topbar from "./Topbar";   // Ensure correct path

// Define the drawer width here or import it from a config/constant file
const drawerWidth = 0; 

export default function MainLayout() {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: "flex", 
        minHeight: '100vh', 
        backgroundColor: theme.palette.background.default // Consistent background
      }}
    >
      {/* 1. Topbar (Header): 
           - Positioned Fixed
           - Spans the full width (handled by the Topbar's internal styling) 
      */}
      <Topbar />

      {/* 2. Sidebar (Navigation): 
           - Positioned Permanent/Fixed
           - Handled by the Sidebar component's internal styling
      */}
      <Sidebar />

      {/* 3. Main Content Area: 
           - This is the container for the actual page content.
           - It must be pushed down by the Topbar's height and pushed right by the Sidebar's width.
      */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Takes up remaining horizontal space
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Calculates main content width
          ml: { sm: `${drawerWidth}px` }, // Offset for Sidebar (pushes content to the right)
          py: 3, // Vertical Padding
          px: 4, // Horizontal Padding (A bit more professional than 'p: 2')
          backgroundColor: theme.palette.grey[50], // Slightly different background for the content area
        }}
      >
        {/* SPACER: The empty Toolbar component is a crucial spacer. 
          It takes up the same height as the fixed Topbar, pushing the content (<Outlet>) down 
          so it doesn't get hidden behind the header.
        */}
        <Toolbar sx={{ minHeight: 70 }} /> 
        {/* Note: minHeight should match the minHeight in your Topbar component */}

        {/* The Outlet renders the content of the currently active route (e.g., Dashboard, Customers) 
        */}
        <Outlet />
      </Box>
    </Box>
  );
}