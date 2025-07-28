import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import type { UpdateTaskData } from "../services/taskService";
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
import SuccessMessage from "../Components/common/SuccessMessage";

const UpdateTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<UpdateTaskData>({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setInitialLoading(true);
      const response = await taskService.getTaskById(id!);
      const task = response.data.task;
      setFormData({
        title: task.title,
        description: task.description,
      });
    } catch (err) {
      console.error("Failed to fetch task details:", err);
      setError(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to fetch task details",
      );
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      await taskService.updateTask(id!, formData);
      setSuccess("Task updated successfully! Redirecting...");
      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (err) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to update task. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  if (initialLoading) {
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
        <LoadingSpinner message="Loading task details..." />
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
      <Container maxWidth="md">
        <Fade in={true} timeout={600}>
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
                  Update Task
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Edit your task details
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
                  helperText={`${formData.title?.length || 0}/100 characters`}
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
                  helperText={`${
                    formData.description?.length || 0
                  }/500 characters`}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
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
                    disabled={
                      loading ||
                      !formData.title?.trim() ||
                      !formData.description?.trim()
                    }
                    sx={{
                      flex: 1,
                      background:
                        "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)",
                      },
                    }}
                  >
                    {loading ? <LoadingSpinner size={24} /> : "Update Task"}
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

export default UpdateTask;
