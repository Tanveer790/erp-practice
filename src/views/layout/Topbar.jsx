import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthContext } from "../../core/AuthContext.jsx";

export default function Topbar() {
  const { user, logout } = useAuthContext();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        width: "100%",        // optional, safe
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="subtitle1">
          Welcome, <strong>{user?.name || "User"}</strong>
        </Typography>

        <Box>
          <IconButton onClick={logout} size="small">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
