import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { authService } from "../services/authService";
import type { LoginData } from "../services/authService";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Fade,
} from "@mui/material";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import ErrorMessage from "../Components/common/ErrorMessage";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    loginIdentifier: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(formData);
      const { user, token } = response.data;

      login(user, token);
      navigate("/tasks");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed, please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Card
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(136, 231, 136, 0.1)",
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(136, 231, 136, 0.2)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box textAlign="center" mb={4}>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to your Tasky account
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <ErrorMessage
                    message={error}
                    onClose={() => setError(null)}
                  />
                )}

                <TextField
                  fullWidth
                  label="Email or Username"
                  name="loginIdentifier"
                  value={formData.loginIdentifier}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  sx={{ mb: 3 }}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  sx={{ mb: 4 }}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    background:
                      "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    mb: 3,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)",
                    },
                  }}
                >
                  {loading ? <LoadingSpinner size={24} /> : "Sign In"}
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: "#88E788",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Sign up here
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
