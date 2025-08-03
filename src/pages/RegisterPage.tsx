import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { RegisterData } from '../services/authService';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Fade,
} from '@mui/material';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';
import SuccessMessage from '../Components/common/SuccessMessage';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    username: '',
    emailAddress: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = (): boolean => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await authService.register(formData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration failed. PLease try again.', err);
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Registration failed. Please try again.',)
      ;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(136, 231, 136, 0.1)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(136, 231, 136, 0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box textAlign="center" mb={4}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Join Tasky and start organizing your tasks
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <ErrorMessage
                    message={error}
                    onClose={() => setError(null)}
                  />
                )}
                {success && <SuccessMessage message={success} />}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{xs:12, sm:6}}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid size={{xs:12, sm:6}}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  sx={{ mb: 3 }}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
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
                  helperText="Password must be at least 6 characters long"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #88E788 0%, #66BB66 100%)',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)',
                    },
                  }}
                >
                  {loading ? <LoadingSpinner size={24} /> : 'Create Account'}
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      style={{
                        color: '#88E788',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Sign in here
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

export default Register;
