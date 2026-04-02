const BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = localStorage.getItem("token");

    // Log the request details
    console.log("=== API Request ===");
    console.log("Endpoint:", `${BASE_URL}${endpoint}`);
    console.log("Method:", options?.method || "GET");
    console.log("Headers:", {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...(options?.headers || {}),
    });

    if (options?.body) {
        console.log("Body:", options.body);
        console.log("Parsed Body:", JSON.parse(options.body as string));
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                ...(options?.headers || {}),
            },
            ...options,
        });

        console.log("Response Status:", response.status);

        // Try to get error details
        const responseData = await response.json().catch(async () => {
            return { error: await response.text() };
        });

        console.log("Response Data:", responseData);

        if (!response.ok) {
            throw new Error(JSON.stringify(responseData));
        }

        return responseData as T;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}