import {
  Typography,
  Paper,
  Grid,
  TextField,
  Stack,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface User {
    firstName: string;
    lastName: string;
    username: string;
    emailAddress: string;
    password: string;
    confirmPassword: string;
}

function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

const { isPending, mutate } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (newUser: User) => {
        const response = await axios.post("https://tasky-backend-tweo.onrender.com/api/auth/register", newUser);
        return response.data;
    }
})

function handleSignUp() {
    const newUser = { firstName, lastName, emailAddress, username, password, confirmPassword };
    mutate(newUser, {
      onSuccess: (data) => {
        console.log("Registration successful:", data);
      },
      onError: (error) => {
        console.error("Registration failed:", error);
        alert("Registration failed.");
      }
    });
}
  return (
    <Box component="section" mt={2}>
      <Typography
        variant="h2"
        fontSize="2.3rem"
        textTransform="uppercase"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Sign up for your free account
      </Typography>

      <Grid container justifyContent="content">
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper component="form" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <TextField label="First Name" type="text" required fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <TextField label="Last Name" type="text" required fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <TextField label="Username" type="text" required fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)}
              />
              <TextField label="Password" type="password" required fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
              <TextField
                label="Confirm Password"
                type="password"
                required
                fullWidth
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button variant="contained" onClick={handleSignUp} loading={isPending}>Sign Up</Button>
              <Typography variant="body1">
                Already have an account? <Link to="/login">Login</Link>
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Register;
