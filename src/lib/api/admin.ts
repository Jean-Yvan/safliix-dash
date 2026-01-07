import { apiRequest } from "./client";
import { type AdminListParams, type AdminListResponse, type AdminProfile, type AdminUpdatePayload } from "@/types/api/admin";

export const adminsApi = {
  list: (params: AdminListParams, accessToken?: string) =>
    apiRequest<AdminListResponse>("/adminUser", { params, accessToken }),

  detail: (id: string, accessToken?: string) =>
    apiRequest<AdminProfile>(`/adminUser/${id}`, { accessToken }),

  update: (id: string, payload: AdminUpdatePayload, accessToken?: string) =>
    apiRequest<AdminProfile>(`/adminUser/${id}`, { method: "PATCH", body: payload, accessToken })
};
