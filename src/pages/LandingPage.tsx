import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Fade,
} from "@mui/material";
import {
  CheckBox as TaskIcon,
  TrendingUp as TrendingUpIcon,
  FolderOpen as FolderIcon,
} from "@mui/icons-material";

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Fade in={true} timeout={1000}>
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "3rem", md: "4rem", lg: "5rem" },
                fontWeight: 700,
                color: "text.primary",
                mb: 3,
              }}
            >
              Welcome to Tasky
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                color: "text.secondary",
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.6,
              }}
            >
              Your personal task management solution. Organize, prioritize, and
              accomplish your goals with ease.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {isAuthenticated ? (
                <Button
                  component={Link}
                  to="/tasks"
                  variant="contained"
                  size="large"
                  sx={{
                    background:
                      "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)",
                    },
                  }}
                >
                  Go to Tasks
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      background:
                        "linear-gradient(135deg, #88E788 0%, #66BB66 100%)",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #66BB66 0%, #4CAF50 100%)",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={4} maxWidth="md" sx={{ mx: "auto" }}>
          {[
            {
              icon: <TaskIcon sx={{ fontSize: 48, color: "primary.main" }} />,
              title: "Organize Tasks",
              description:
                "Create, edit, and organize your tasks efficiently with our intuitive interface.",
            },
            {
              icon: (
                <TrendingUpIcon sx={{ fontSize: 48, color: "primary.main" }} />
              ),
              title: "Track Progress",
              description:
                "Mark tasks as complete and track your productivity over time.",
            },
            {
              icon: <FolderIcon sx={{ fontSize: 48, color: "primary.main" }} />,
              title: "Manage Categories",
              description:
                "Organize tasks with completed and trash sections for better management.",
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Fade in={true} timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(136, 231, 136, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(136, 231, 136, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;
