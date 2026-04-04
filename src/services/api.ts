const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("access_token");

    const headers: Record<string, string> = {
        Authorization: token ? `Bearer ${token}` : "",
        ...(options?.headers as Record<string, string> || {}),
    };

    // If we are NOT sending FormData, we MUST specify application/json
    if (!(options?.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const fetchOptions = {
        ...options,
        headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    // Standard 401/Unauthorized logic would go here

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
        // This will log the "Field required" details to your console
        console.error("API Error Response:", responseData);
        throw new Error(JSON.stringify(responseData));
    }

    return responseData as T;
}