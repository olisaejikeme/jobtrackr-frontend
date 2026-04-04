import { apiRequest } from "./api";

// Define types properly
interface User {
    id: number;
    name: string;
    email: string;
    created_at?: string;
}

interface LoginResponse {
    data: {
        access_token: string;
        refresh_token: string;
        token_type?: string;
        user?: User;
    };
    message: string;
    status: boolean;
    status_code: number;
}

interface RegisterResponse {
    data: {
        user: User;
        access_token?: string;
    };
    message: string;
    status: boolean;
    status_code: number;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation?: string;
}

interface ApiResponse<T> {
    data: T;
    message: string;
    status: boolean;
    status_code: number;
}

interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export async function login(data: { email: string; password: string }): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (response.data) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
    }
    return response;
}

export async function refreshToken(): Promise<string | null> {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return null;

    try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token }),
        });

        if (!response.ok) throw new Error("Refresh failed");

        const result = await response.json();
        const { access_token, refresh_token: new_refresh } = result.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", new_refresh);

        return access_token;
    } catch (err) {
        logout();
        return null;
    }
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
    console.log("Register called with:", { email: data.email, name: data.name });

    try {
        const response = await apiRequest<RegisterResponse>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        });

        console.log("Register response:", response);

        // Optional: Store token if returned immediately after registration
        if (response.data?.access_token) {
            localStorage.setItem("access_token", response.data.access_token);
        }

        return response;
    } catch (error) {
        console.error("Register API error:", error);
        throw error;
    }
}

export async function forgotPassword(email: string) {
    return await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function resetPassword(password: string, token: string) {
    return await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ password, token }),
    });
}

export async function changePassword(passwords: ChangePasswordData) {
    const token = localStorage.getItem("access_token");
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            current_password: passwords.currentPassword,
            new_password: passwords.newPassword
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to update password");
    }
    return response.json();
}

export async function getUserMe(): Promise<ApiResponse<User>> {
    return await apiRequest<ApiResponse<User>>("/users/me", {
        method: "GET",
    });
}

export async function updateProfile(data: { name?: string; email?: string }): Promise<ApiResponse<User>> {
    return await apiRequest<ApiResponse<User>>("/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

// Helper function to logout
export function logout(): void {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token");
    return !!token;
}

// Helper function to get the current token
export function getToken(): string | null {
    return localStorage.getItem("access_token");
}