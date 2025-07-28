import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { SxProps } from '@mui/system';
import { taskService, Task } from '../../services/taskService';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as CircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import LoadingSpinner from '../common/LoadingSpinner';

interface TaskCardProps {
  task: Task;
  onTaskUpdate: (taskId: string, updatedTask: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  showActions?: boolean;
  variant?: 'default' | 'completed' | 'trash';
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  showActions = true,
  variant = 'default'
}) => {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      if (task.isCompleted) {
        await taskService.incompleteTask(task.id);
        onTaskUpdate(task.id, { isCompleted: false });
      } else {
        await taskService.completeTask(task.id);
        onTaskUpdate(task.id, { isCompleted: true });
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await taskService.deleteTask(task.id);
      onTaskDelete(task.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      await taskService.restoreTask(task.id);
      onTaskUpdate(task.id, { isDeleted: false });
    } catch (error) {
      console.error('Error restoring task:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCardStyles = (): SxProps => {
      const styles: SxProps = {
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(136, 231, 136, 0.2)',
        },
      };

    if (variant === 'completed') {
      styles.opacity = 0.8;
      styles.borderLeft = '4px solid #4CAF50';
    } else if (variant === 'trash') {
      styles.borderLeft = '4px solid #f44336';
      styles.backgroundColor = '#ffebee';
    } else {
      styles.borderLeft = '4px solid #88E788';
    }

    return styles;
  };

  return (
    <Fade in={true} timeout={300}>
      <Card sx={getCardStyles()}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                textDecoration: task.isCompleted ? 'line-through' : 'none',
                color: task.isCompleted ? 'text.secondary' : 'text.primary',
                fontWeight: 600,
              }}
            >
              {task.title}
            </Typography>
            {loading && <LoadingSpinner size={20} />}
          </Box>

          {task.isCompleted && (
            <Chip
              label="Completed"
              size="small"
              color="success"
              sx={{ mb: 2 }}
            />
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            {task.description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(task.dateCreated)}
            </Typography>
            {task.dateUpdated !== task.dateCreated && (
              <Typography variant="caption" color="text.secondary">
                Updated: {formatDate(task.dateUpdated)}
              </Typography>
            )}
          </Box>
        </CardContent>

        {showActions && (
          <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {variant === 'default' && (
                <>
                  <Button
                    onClick={handleComplete}
                    variant={task.isCompleted ? "outlined" : "contained"}
                    size="small"
                    disabled={loading}
                    startIcon={task.isCompleted ? <CircleIcon /> : <CheckCircleIcon />}
                    sx={{
                      background: !task.isCompleted ? 'linear-gradient(135deg, #88E788 0%, #66BB66 100%)' : undefined,
                    }}
                  >
                    {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                  <Button
                    component={Link}
                    to={`/tasks/update/${task.id}`}
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={loading}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </>
              )}

              {variant === 'completed' && (
                <>
                  <Button
                    onClick={handleComplete}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    startIcon={<CircleIcon />}
                  >
                    Mark Incomplete
                  </Button>
                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={loading}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </>
              )}

              {variant === 'trash' && (
                <Button
                  onClick={handleRestore}
                  variant="contained"
                  size="small"
                  disabled={loading}
                  startIcon={<RestoreIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #88E788 0%, #66BB66 100%)',
                  }}
                >
                  Restore
                </Button>
              )}
            </Box>
          </CardActions>
        )}

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this task? This action can be undone from the trash.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Fade>
  );
};

export default TaskCard;

