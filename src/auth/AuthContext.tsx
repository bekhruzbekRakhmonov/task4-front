import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	ReactElement,
	useEffect,
} from "react";
import * as api from "../utils/api";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { CircularProgress } from "@mui/material";

interface AuthContextProps {
	user: any | null;
	isAuthenticated: boolean;
	login: (credentials: any) => Promise<void>;
	register: (userData: any) => Promise<void>;
	logout: () => Promise<void>;
	error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
	children,
}: AuthProviderProps): ReactElement => {
	const [user, setUser] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	const isAuthenticated = !!user;

	useEffect(() => {
		const checkAuth = async () => {
			const accessToken = Cookies.get("accessToken");
			const refreshToken = Cookies.get("refreshToken");
			if (accessToken && refreshToken) {
				try {
					const userData = jwtDecode(accessToken);
					setUser(userData);
				} catch (error) {
					console.error("Invalid access token:", error);
					// Perform logout or redirect to login page
					Cookies.remove("accessToken");
					Cookies.remove("refreshToken");

				}
			}
			setLoading(false);
		};

		checkAuth();
	}, []); 

	const login = async (credentials: any): Promise<void> => {
		try {
			const response = await api.login(credentials);
			console.log("Response: ",response);
			const { accessToken, refreshToken } = response.data;

			Cookies.set("accessToken", accessToken);
			Cookies.set("refreshToken", refreshToken);
			const userData = jwtDecode(accessToken);
			setUser(userData);
			setError(null);
		} catch (error) {
			setError("Invalid credentials. Please try again.");
			throw error;
		}
	};

	const register = async (userData: any): Promise<void> => {
		try {
			const newUser = await api.register(userData);
			setUser(newUser.data);
			setError(null);
		} catch (error) {
			setError("Registration failed. Please try again.");
			throw error;
		}
	};

	const logout = async (): Promise<void> => {
		try {
			setUser(null);
			setError(null);
			Cookies.remove("accessToken");
			Cookies.remove("refreshToken");
		} catch (error) {
			setError("Logout failed. Please try again.");
			throw error;
		}
	};

	if (loading) {
		// Loading spinner
		return <div>
			<CircularProgress/>
		</div>;
	}

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, login, register, logout, error }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
