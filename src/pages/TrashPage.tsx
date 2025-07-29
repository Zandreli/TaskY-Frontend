import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import type { Task } from "../services/taskService";
import TaskCard from "../Components/Tasks/TaskCard";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import ErrorMessage from "../Components/common/ErrorMessage";
import SuccessMessage from "../Components/common/SuccessMessage";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Fade,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const Trash: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  const fetchDeletedTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getDeletedTasks();
      setTasks(response.data.tasks);
    } catch (err) {
      console.error("Failed to fetch deleted tasks:", err);
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch deleted tasks",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (taskId: string, updatedTask: Partial<Task>) => {
    if (updatedTask.isDeleted === false) {
      
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      setSuccess("Task restored successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } else {
      // Update task in place
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task,
        ),
      );
    }
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleRestoreAll = async () => {
    if (tasks.length === 0) return;

    const confirmMessage = `Are you sure you want to restore all ${tasks.length} tasks?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setActionLoading(true);
      // Restore all tasks
      await Promise.all(tasks.map((task) => taskService.restoreTask(task.id)));
      setTasks([]);
      setSuccess("All tasks restored successfully!");
    } catch (err) {
      console.error("Failed to restore all tasks:", err);
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to restore all tasks",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const calculateAverageDaysInTrash = () => {
    if (tasks.length === 0) return 0;

    const totalDays = tasks.reduce((acc, task) => {
      const daysSinceDeleted = Math.ceil(
        (new Date().getTime() - new Date(task.dateUpdated).getTime()) /
          (1000 * 3600 * 24),
      );
      return acc + daysSinceDeleted;
    }, 0);

    return Math.ceil(totalDays / tasks.length);
  };

  if (loading && tasks.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner message="Loading deleted tasks..." />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Fade in={true} timeout={600}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 4,
              }}
            >
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                Trash
              </Typography>
              {tasks.length > 0 && (
                <Button
                  onClick={handleRestoreAll}
                  disabled={actionLoading}
                  variant="contained"
                  startIcon={<RestoreIcon />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                    px: 3,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)",
                    },
                  }}
                >
                  Restore All
                </Button>
              )}
            </Box>

            {error && (
              <ErrorMessage message={error} onClose={() => setError(null)} />
            )}
            {success && (
              <SuccessMessage
                message={success}
                onClose={() => setSuccess(null)}
              />
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(244, 67, 54, 0.2)",
                    borderLeft: "4px solid #f44336",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "#f44336", fontWeight: 700, mb: 1 }}
                    >
                      {tasks.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Deleted Tasks
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(244, 67, 54, 0.2)",
                    borderLeft: "4px solid #f44336",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "#f44336", fontWeight: 700, mb: 1 }}
                    >
                      {calculateAverageDaysInTrash()}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Avg Days in Trash
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {tasks.length === 0 ? (
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(136, 231, 136, 0.1)",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 8 }}>
                    <DeleteIcon
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      Trash is empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Deleted tasks will appear here. You can restore them or
                      they'll be permanently deleted after 30 days.
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Alert
                    severity="warning"
                    icon={<WarningIcon />}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: "#fff3cd",
                      color: "#856404",
                      "& .MuiAlert-icon": {
                        color: "#856404",
                      },
                    }}
                  >
                    ⚠️ Tasks in trash will be permanently deleted after 30 days.
                    Restore important tasks before they're gone forever.
                  </Alert>

                  {tasks.map((task, index) => (
                    <Fade key={task.id} in={true} timeout={600 + index * 100}>
                      <div>
                        <TaskCard
                          task={task}
                          onTaskUpdate={handleTaskUpdate}
                          onTaskDelete={handleTaskDelete}
                          variant="trash"
                        />
                      </div>
                    </Fade>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Trash;
