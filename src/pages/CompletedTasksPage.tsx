import React, { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import type { Task } from "../services/taskService";
import TaskCard from "../Components/Tasks/TaskCard";
import LoadingSpinner from "../Components/common/LoadingSpinner";
import ErrorMessage from "../Components/common/ErrorMessage";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Fade,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

const CompletedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getCompletedTasks();
      setTasks(response.data.tasks);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch completed tasks");
      }
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        setError(
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "Failed to fetch completed tasks",
        );
      } else {
        setError("Failed to fetch completed tasks");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (taskId: string, updatedTask: Partial<Task>) => {
    if (updatedTask.isCompleted === false) {
      // Task was marked as incomplete, remove from completed list
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
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

  if (loading) {
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
        <LoadingSpinner message="Loading completed tasks..." />
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
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                Completed Tasks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tasks.length} completed tasks
              </Typography>
            </Box>

            {error && (
              <ErrorMessage message={error} onClose={() => setError(null)} />
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(136, 231, 136, 0.1)",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}
                    >
                      {tasks.length}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Completed Tasks
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(136, 231, 136, 0.1)",
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Typography
                      variant="h3"
                      sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}
                    >
                      {tasks.length > 0 ? "100" : "0"}%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Completion Rate
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
                    <CheckCircleIcon
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      No completed tasks yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Tasks you mark as complete will appear here. Keep up the
                      great work!
                    </Typography>
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
                        variant="completed"
                      />
                    </div>
                  </Fade>
                ))
              )}
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CompletedTasks;
