import { apiRequest } from "./api";

type ApiResponse<T> = {
    status: boolean;
    message: string;
    data: T;
};

export interface Resume {
    id: number;
    file_name: string;
    file_path: string;
    uploaded_at?: string;
    created_at: string;
}

export async function getResumes() {
    return await apiRequest<ApiResponse<Resume[]>>("/resumes");
}

export async function uploadResume(file: File, displayName?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (displayName) {
        formData.append("display_name", displayName);
    }

    return await apiRequest<ApiResponse<Resume>>("/resumes/upload", {
        method: "POST",
        body: formData, // apiRequest should NOT set Content-Type for FormData
    });
}

export async function deleteResume(id: number) {
    return await apiRequest<ApiResponse<null>>(`/resumes/${id}`, {
        method: "DELETE",
    });
}