import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import type { CreateTaskData } from '../services/taskService';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Fade,
} from '@mui/material';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';
import SuccessMessage from '../Components/common/SuccessMessage';

const NewTask: React.FC = () => {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: ''
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
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await taskService.createTask(formData);
      setSuccess('Task created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    } catch (error) {
      console.error("Failed to create task:", error)
      const errorMessage = 'Failed to create task. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Fade in={true} timeout={600}>
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
                  Create New Task
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Add a new task to your list
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
                {success && <SuccessMessage message={success} />}

                <TextField
                  fullWidth
                  label="Task Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  sx={{ mb: 3 }}
                  variant="outlined"
                  inputProps={{ maxLength: 100 }}
                  helperText={`${formData.title.length}/100 characters`}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  multiline
                  rows={6}
                  sx={{ mb: 4 }}
                  variant="outlined"
                  inputProps={{ maxLength: 500 }}
                  helperText={`${formData.description.length}/500 characters`}
                />

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !formData.title.trim() || !formData.description.trim()}
                    sx={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #88E788 0%, #66BB66 100%)',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)',
                      },
                    }}
                  >
                    {loading ? <LoadingSpinner size={24} /> : 'Create Task'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default NewTask;

