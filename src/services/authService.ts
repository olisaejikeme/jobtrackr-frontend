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

export async function login(data: { email: string; password: string }): Promise<LoginResponse> {
    console.log("Login called with:", { email: data.email });

    try {
        const response = await apiRequest<LoginResponse>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        });

        console.log("Login response:", response);

        // Optional: Store token immediately
        if (response.data?.access_token) {
            localStorage.setItem("token", response.data.access_token);
        }

        return response;
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
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
            localStorage.setItem("token", response.data.access_token);
        }

        return response;
    } catch (error) {
        console.error("Register API error:", error);
        throw error;
    }
}

// Helper function to logout
export function logout(): void {
    localStorage.removeItem("token");
    console.log("User logged out");
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    return !!token;
}

// Helper function to get the current token
export function getToken(): string | null {
    return localStorage.getItem("token");
}