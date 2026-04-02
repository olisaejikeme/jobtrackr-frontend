import { apiRequest } from "./api";

type ApiResponse<T> = {
    status: boolean;
    message: string;
    data: T;
};

type Application = {
    id: number;
    company_name: string;
    job_title: string;
    status: string;
    application_date: string;
};

export async function getApplications() {
    const response = await apiRequest<ApiResponse<Application[]>>("/applications");

    console.log(response);
    return response;
}

export async function createApplication(data: Omit<Application, 'id' | 'application_date'>) {
    const response = await apiRequest<ApiResponse<Application>>("/applications", {
        method: "POST",
        body: JSON.stringify(data),
    });
    return response;
}

export function updateApplication(id: number, data: any) {
    return apiRequest(`/applications/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export function deleteApplication(id: number) {
    return apiRequest(`/applications/${id}`, {
        method: "DELETE",
    });
}