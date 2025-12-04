import { apiRequest } from "./client";
import {
  type DashboardHighlightsResponse,
  type DashboardMetricsParams,
  type DashboardMetricsResponse,
  type DashboardRepartitionParams,
  type DashboardRepartitionResponse,
} from "@/types/api/dashboard";

export const dashboardApi = {
  getMetrics: (params?: DashboardMetricsParams, signal?: AbortSignal, accessToken?: string) =>
    apiRequest<DashboardMetricsResponse>("/dashboard/metrics", { params, signal, accessToken }),

  getHighlights: (signal?: AbortSignal, accessToken?: string) =>
    apiRequest<DashboardHighlightsResponse>("/dashboard/highlights", { signal, accessToken }),

  getRepartition: (params?: DashboardRepartitionParams, signal?: AbortSignal, accessToken?: string) =>
    apiRequest<DashboardRepartitionResponse>("/dashboard/repartition", { params, signal, accessToken }),
};
