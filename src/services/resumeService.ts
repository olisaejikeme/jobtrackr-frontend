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
    created_at: string;
}

export async function getResumes() {
    return await apiRequest<ApiResponse<Resume[]>>("/resumes");
}

export async function uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return await apiRequest<ApiResponse<Resume>>("/resumes/upload", {
        method: "POST",
        body: formData,
    });
}