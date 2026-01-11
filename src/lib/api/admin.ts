
import { apiRequest } from "./client";
import { type AdminListParams, type AdminListResponse, type AdminProfile, type AdminUpdatePayload, type AdminFormState } from "@/types/api/admin";

export const adminsApi = {

  create: (payload: AdminFormState, accessToken?:string) => apiRequest<void>("/adminUser",{method:"POST",body:payload,accessToken}),

  list: (params: AdminListParams, accessToken?: string) =>
    apiRequest<AdminListResponse>("/adminUser", { params, accessToken }),

  detail: (id: string, accessToken?: string) =>
    apiRequest<AdminProfile>(`/adminUser/${id}`, { accessToken }),

  getById: (id:string, accessToken?:string) => apiRequest<AdminFormState>(`/adminUser/${id}`,{ accessToken }),

  update: (id: string, payload: AdminUpdatePayload, accessToken?: string) =>
    apiRequest<AdminProfile>(`/adminUser/${id}`, { method: "PUT", body: payload, accessToken }),

  delete: (id:string, accessToken?:string) => apiRequest<void>(`/adminUser/${id}`, {accessToken})
};
