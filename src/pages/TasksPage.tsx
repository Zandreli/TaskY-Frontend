import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/taskService';
import type { Task } from '../services/taskService';
import TaskCard from '../Components/Tasks/TaskCard';
import LoadingSpinner from '../Components/common/LoadingSpinner';
import ErrorMessage from '../Components/common/ErrorMessage';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Fab,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckBox as TaskIcon,
} from '@mui/icons-material';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getActiveTasks();
      setTasks(response.data.tasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (taskId: string, updatedTask: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updatedTask } : task
      ).filter(task => !task.isCompleted && !task.isDeleted)
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LoadingSpinner message="Loading your tasks..." />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Fade in={true} timeout={600}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                mb: 4,
              }}
            >
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                My Tasks
              </Typography>
              <Button
                component={Link}
                to="/tasks/new"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #88E788 0%, #66BB66 100%)',
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)',
                  },
                }}
              >
                Add New Task
              </Button>
            </Box>

            {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{xs:12, md:6}}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(136, 231, 136, 0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
                      {tasks.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Active Tasks
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(136, 231, 136, 0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
                      {tasks.filter(t => !t.isCompleted).length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Pending
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {tasks.length === 0 ? (
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(136, 231, 136, 0.1)',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 8 }}>
                    <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      No tasks yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                      Create your first task to get started with organizing your work.
                    </Typography>
                    <Button
                      component={Link}
                      to="/tasks/new"
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #88E788 0%, #66BB66 100%)',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)',
                        },
                      }}
                    >
                      Create Your First Task
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                tasks.map((task, index) => (
                  <Fade key={task.id} in={true} timeout={600 + index * 100}>
                    <div>
                      <TaskCard
                        task={task}
                        onTaskUpdate={handleTaskUpdate}
                        onTaskDelete={handleTaskDelete}
                        variant="default"
                      />
                    </div>
                  </Fade>
                ))
              )}
            </Box>
          </Box>
        </Fade>

        {/* Floating Action Button for mobile */}
        <Fab
          component={Link}
          to="/tasks/new"
          color="primary"
          aria-label="add task"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #88E788 0%, #66BB66 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)',
            },
            display: { xs: 'flex', sm: 'none' },
          }}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  );
};

export default Tasks;

