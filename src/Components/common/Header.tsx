import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  CheckBox as TaskIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Archive as ArchiveIcon,
  Delete as TrashIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: "Tasks", path: "/tasks", icon: <TaskIcon /> },
    { label: "Completed", path: "/tasks/completed/:id", icon: <ArchiveIcon /> },
    { label: "Trash", path: "/tasks/trash/:id", icon: <TrashIcon /> },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const renderDesktopNav = () => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {isAuthenticated ? (
        <>
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              color="inherit"
              startIcon={item.icon}
              sx={{
                color: "white",
                backgroundColor: isActiveRoute(item.path)
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 2 }}>
            <Typography variant="body2" sx={{ color: "white" }}>
              Hello, {user?.firstName}
            </Typography>
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar
                src={
                  user?.avatar
                    ? `${import.meta.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:3000"}${user.avatar}`
                    : undefined
                }
                sx={{
                  width: 32,
                  height: 32,
                  border: "2px solid white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </Avatar>
            </IconButton>
          </Box>
        </>
      ) : (
        <>
          <Button
            component={Link}
            to="/login"
            color="inherit"
            sx={{ color: "white" }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                backgroundColor: "white",
                color: "primary.main",
              },
            }}
          >
            Register
          </Button>
        </>
      )}
    </Box>
  );

  const renderMobileNav = () => (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={() => setMobileMenuOpen(true)}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={() => setMobileMenuOpen(false)}
        >
          <List>
            {isAuthenticated ? (
              <>
                <ListItem>
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}
                  >
                    <Avatar
                      src={
                        user?.avatar
                          ? `${import.meta.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:3000"}${user.avatar}`
                          : undefined
                      }
                      sx={{ bgcolor: "primary.main" }}
                    >
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </Avatar>
                    <Typography variant="subtitle1">
                      {user?.firstName} {user?.lastName}
                    </Typography>
                  </Box>
                </ListItem>
                {navigationItems.map((item) => (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    selected={isActiveRoute(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
                <ListItemButton component={Link} to="/profile">
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton component={Link} to="/register">
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          {isMobile && renderMobileNav()}

          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <TaskIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Tasky
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && renderDesktopNav()}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          <PersonIcon sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
