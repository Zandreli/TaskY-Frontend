import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import type { UpdateUserData } from "../services/userService";
import type { UpdatePasswordData } from "../services/authService";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  Person as PersonIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import ErrorMessage from "../Components/common/ErrorMessage";
import SuccessMessage from "../Components/common/SuccessMessage";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<UpdateUserData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState<
    UpdatePasswordData & { confirmPassword: string }
  >({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    clearMessages();
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    clearMessages();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    clearMessages();
  };

  const clearMessages = () => {
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await userService.updateProfile(formData);
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("profile update failed:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(true);
    setError(null);

    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password updated successfully!");
    } catch (err) {
      console.error("Password update failed:", err);
      alert("Failed to update password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setAvatarLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await userService.uploadAvatar(formData);
      const updatedUser = response.data.user;
      updateUser(updatedUser);
      setSuccess("Profile picture updated successfully!");
    } catch (err) {
      console.error("Profile picture update failed:", err);
      alert("Failed to update profile picture. Please try again.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Fade in={true} timeout={600}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(136, 231, 136, 0.1)",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(136, 231, 136, 0.2)",
              overflow: "hidden",
            }}
          >
            {/* Header with gradient background */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                color: "white",
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={
                      user?.avatar
                        ? `${process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:3000"}${user.avatar}`
                        : undefined
                    }
                    sx={{
                      width: 96,
                      height: 96,
                      border: "4px solid white",
                      fontSize: "2rem",
                    }}
                  >
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Avatar>
                  {avatarLoading && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LoadingSpinner size={24} />
                    </Box>
                  )}
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: -8,
                      right: -8,
                      backgroundColor: "white",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "grey.100",
                      },
                    }}
                    disabled={avatarLoading}
                  >
                    <CameraIcon />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      hidden
                    />
                  </IconButton>
                </Box>

                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                    @{user?.username}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Member since{" "}
                    {user?.dateJoined ? formatDate(user.dateJoined) : "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <CardContent sx={{ p: 0 }}>
              {error && (
                <Box sx={{ p: 3, pb: 0 }}>
                  <ErrorMessage
                    message={error}
                    onClose={() => setError(null)}
                  />
                </Box>
              )}
              {success && (
                <Box sx={{ p: 3, pb: 0 }}>
                  <SuccessMessage
                    message={success}
                    onClose={() => setSuccess(null)}
                  />
                </Box>
              )}

              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    minHeight: 64,
                  },
                }}
              >
                <Tab
                  icon={<PersonIcon />}
                  label="Profile Information"
                  iconPosition="start"
                />
                <Tab
                  icon={<LockIcon />}
                  label="Change Password"
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ p: 3 }}>
                <TabPanel value={tabValue} index={0}>
                  <Box component="form" onSubmit={handleProfileSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleProfileChange}
                          required
                          disabled={loading}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleProfileChange}
                          required
                          disabled={loading}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleProfileChange}
                          required
                          disabled={loading}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleProfileChange}
                          required
                          disabled={loading}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            background:
                              "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                            px: 4,
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)",
                            },
                          }}
                        >
                          {loading ? (
                            <LoadingSpinner size={24} />
                          ) : (
                            "Update Profile"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box component="form" onSubmit={handlePasswordSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          name="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          disabled={passwordLoading}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="New Password"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          disabled={passwordLoading}
                          variant="outlined"
                          helperText="Password must be at least 6 characters long"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          disabled={passwordLoading}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={passwordLoading}
                          sx={{
                            background:
                              "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                            px: 4,
                            py: 1.5,
                            fontSize: "1rem",
                            fontWeight: 600,
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)",
                            },
                          }}
                        >
                          {passwordLoading ? (
                            <LoadingSpinner size={24} />
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </TabPanel>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Profile;
