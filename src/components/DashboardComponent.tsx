import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Checkbox,
	Toolbar,
	Paper,
	IconButton,
	Box,
	TablePagination,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
} from "@mui/material";
import { Delete, Lock, LockOpen } from "@mui/icons-material";
import HeaderComponent from "./HeaderComponent";
import * as api from "../utils/api";
import { useAuth } from "../auth/AuthContext";


interface Data {
	id: number;
	name: string;
	email: string;
	last_login: Date;
	status: string;
}

const rowsPerPageOptions = [5, 10, 25];

const DashboardComponent: React.FC = () => {
	const [selected, setSelected] = useState<number[]>([]);
	const [data, setData] = useState<Data[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
	const [change, setChange] = useState<boolean>(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const { user, logout } = useAuth();

	useEffect(() => {
		Promise.resolve(api.getUsers())
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.error("Error fetching users data:", error);
			});
		setChange(false);
	}, [change]);

	const handleSelectAllClick = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.checked) {
			const newSelecteds = data.map((d) => d.id);
			setSelected(newSelecteds);
		} else {
			setSelected([]);
		}
	};

	const handleCheckboxClick = (id: number) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const isSelected = (id: number) => selected.indexOf(id) !== -1;

	const handleDeleteDialogOpen = () => {
		setDeleteDialogOpen(true);
	};

	const handleDeleteDialogClose = () => {
		setDeleteDialogOpen(false);
	};

	const handleDeleteConfirmation = async () => {
		setDeleteDialogOpen(false);
		try {
			await api.deleteUsers(selected);
			if (selected.includes(user.id)) {
				await logout();
			}
			setChange(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleBlock = async () => {
		try {
			await api.blockUsers(selected);
			if (selected.includes(user.id)) {
				await logout();
			}
			setChange(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleUnblock = async () => {
		try {
			await api.unblockUsers(selected);
			setChange(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			<HeaderComponent />
			<Box sx={{ margin: 3 }}>
				<Toolbar>
					<IconButton
						color="primary"
						onClick={handleBlock}
						sx={{ borderRadius: 0 }}
					>
						<Lock /> Block
					</IconButton>
					<IconButton
						color="primary"
						onClick={handleUnblock}
						sx={{ borderRadius: 0 }}
					>
						<LockOpen /> Unblock
					</IconButton>
					<IconButton
						color="secondary"
						onClick={handleDeleteDialogOpen}
						sx={{ borderRadius: 0 }}
					>
						<Delete /> Delete
					</IconButton>
				</Toolbar>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<Checkbox
										checked={
											selected.length === data.length
										}
										indeterminate={
											selected.length > 0 &&
											selected.length < data.length
										}
										onChange={handleSelectAllClick}
									/>
								</TableCell>
								<TableCell>ID</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Last login</TableCell>
								<TableCell>Status</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row) => (
									<TableRow
										key={row.id}
										selected={isSelected(row.id)}
										onClick={() =>
											handleCheckboxClick(row.id)
										}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={isSelected(row.id)}
												color="primary"
											/>
										</TableCell>
										<TableCell>{row.id}</TableCell>
										<TableCell>{row.name}</TableCell>
										<TableCell>{row.email}</TableCell>
										<TableCell>
											{new Date(
												row.last_login
											).toDateString()}
										</TableCell>
										<TableCell>{row.status}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={rowsPerPageOptions}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
				<Dialog
					open={deleteDialogOpen}
					onClose={handleDeleteDialogClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{"Are you sure?"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							This action cannot be undone. Are you sure you want
							to delete the selected items?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleDeleteDialogClose}
							color="primary"
						>
							Cancel
						</Button>
						<Button
							onClick={handleDeleteConfirmation}
							color="warning"
							autoFocus
						>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</>
	);
};

export default DashboardComponent;
