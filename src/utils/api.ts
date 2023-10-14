import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const API_BASE_URL = "https://bekhruzbek/task4/api";

const api = axios.create({
	baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
	let accessToken = Cookies.get("accessToken");

	if (accessToken) {
		const expirationTime = new Date(
			jwtDecode<{ exp: number }>(accessToken).exp * 1000
		);
		if (expirationTime <= new Date()) {
			const refreshToken = Cookies.get("refreshToken");
			try {
				const response = await api.post("/auth/refresh-token", {
					refreshToken,
				});
				accessToken = response.data.accessToken;

				Cookies.set("accessToken", accessToken as string, {
					httpOnly: true,
					secure: true,
				});
			} catch (error) {
				// Handle refresh token error (e.g., redirect to login page)
				console.error("Error refreshing access token:", error);
				// Redirect to the login page or handle the error appropriately
			}
		}
		// Add the new access token to the authorization header
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

export const register = async (userData: any): Promise<AxiosResponse> => {
	const response = await axios.post(
		`${API_BASE_URL}/auth/register`,
		userData
	);
	return response;
};

export const login = async (credentials: any): Promise<AxiosResponse> => {
	const response = await axios.post(
		`${API_BASE_URL}/auth/login`,
		credentials
	);
	return response;
};

export const logout = async (): Promise<AxiosResponse> => {
	const response = await axios.post(`/auth/logout`);
	return response;
};

export const getUsers = async (): Promise<AxiosResponse> => {
	const response = await api.get("/users");
	return response;
};

export const blockUsers = async (userIds: number[]): Promise<AxiosResponse> => {
	const response = await api.put("/users/block", { userIds });
	return response;
};

export const unblockUsers = async (
	userIds: number[]
): Promise<AxiosResponse> => {
	const response = await api.put("/users/unblock", { userIds });
	return response;
};

export const deleteUsers = async (
	userIds: number[]
): Promise<AxiosResponse> => {
	const response = await api.post("/users/delete", { userIds });
	return response;
};
