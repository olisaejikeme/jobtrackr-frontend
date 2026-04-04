import { apiRequest } from "./api";



type ApiResponse<T> = {

    status: boolean;

    message: string;

    data: T;

};



export type Application = {

    id: number;

    company_name: string;

    job_title: string;

    location?: string;

    status: string;

    application_date?: string;

    job_link?: string;

    job_description?: string;

    resume_id?: number;

    notes?: string;

};



export type ApplicationCreate = {

    company_name: string;

    job_title: string;

    status: string;

    location?: string;

    application_date?: string;

    job_link?: string;

    job_description?: string;

    resume_id?: number | null;

    notes?: string;

};



export async function getApplications() {

    return await apiRequest<ApiResponse<Application[]>>("/applications");

}



export async function createApplication(data: ApplicationCreate) {

    return await apiRequest<ApiResponse<any>>("/applications", {

        method: "POST",

        body: JSON.stringify(data),

    });

}



export function updateApplication(id: number, data: Partial<ApplicationCreate>) {

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