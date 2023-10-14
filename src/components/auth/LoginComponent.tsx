import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { TextField, Button, Typography, Box } from "@mui/material";
import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";


const LoginComponent = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  let { login, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
		try {
			await login(credentials);
			navigate('/users');
		} catch (err) {
			if (err instanceof AxiosError) {
				error = "Internal Server Error"
			}
		}
  };

  return (
		<Box sx={{ maxWidth: 300, margin: "auto", mt: 3 }}>
			<Typography variant="h4" align="center" gutterBottom>
				Login
			</Typography>
			{error && (
				<Typography variant="body2" color="error" align="center" mb={2}>
					{error}
				</Typography>
			)}
			<TextField
				label="Email"
				fullWidth
				margin="normal"
				value={credentials.email}
				onChange={(e) =>
					setCredentials({ ...credentials, email: e.target.value })
				}
			/>
			<TextField
				label="Password"
				fullWidth
				margin="normal"
				type="password"
				value={credentials.password}
				onChange={(e) =>
					setCredentials({ ...credentials, password: e.target.value })
				}
			/>
			<Button variant="contained" onClick={handleLogin} fullWidth>
				Login
			</Button>
			<Typography variant="body2" align="center" mt={2}>
				Not registered yet? <Link to="/register">Register here</Link>
			</Typography>
		</Box>
  );
};

export default LoginComponent;
