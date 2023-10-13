import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { TextField, Button, Typography, Box, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";

const RegisterComponent = () => {
	const navigate = useNavigate(); // Replace useHistory with useNavigate
	const [userData, setUserData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const { register } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [open, setOpen] = useState<boolean>(false);

	const handleRegister = async () => {
		try {
			await register(userData);
			navigate("/login");
		} catch (error) {
			setError("Registration failed. Please try again.");
			setOpen(true);
		}
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ maxWidth: 300, margin: "auto", mt: 3 }}>
			<Typography variant="h4" align="center" gutterBottom>
				Register
			</Typography>
			<TextField
				label="Name"
				fullWidth
				margin="normal"
				value={userData.name}
				onChange={(e) =>
					setUserData({ ...userData, name: e.target.value })
				}
			/>
			<TextField
				label="Email"
				fullWidth
				margin="normal"
				value={userData.email}
				onChange={(e) =>
					setUserData({ ...userData, email: e.target.value })
				}
			/>
			<TextField
				label="Password"
				fullWidth
				margin="normal"
				type="password"
				value={userData.password}
				onChange={(e) =>
					setUserData({ ...userData, password: e.target.value })
				}
			/>
			<Button variant="contained" onClick={handleRegister} fullWidth>
				Register
			</Button>

			<Typography variant="body2" align="center" mt={2}>
				Already registered? <Link to="/login">Login here</Link>
			</Typography>

			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				<MuiAlert
					elevation={6}
					variant="filled"
					onClose={handleClose}
					severity="error"
				>
					{error}
				</MuiAlert>
			</Snackbar>
		</Box>
	);
};

export default RegisterComponent;
