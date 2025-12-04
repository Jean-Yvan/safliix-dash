import { apiRequest } from "./client";
import { type IntroResourcesResponse, type ReportListResponse } from "@/types/api/reports";

export const reportsApi = {
  list: (accessToken?: string) => apiRequest<ReportListResponse>("/reports", { accessToken }),
  download: (id: string, accessToken?: string) => apiRequest<Blob>(`/reports/${id}/download`, { accessToken }),
};

export const introApi = {
  resources: (accessToken?: string) => apiRequest<IntroResourcesResponse>("/intro/resources", { accessToken }),
};
