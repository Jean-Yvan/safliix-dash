import { apiRequest } from "./client";
import {
  type FilmsStatsResponse,
  type PubStatsDetail,
  type PubStatsResponse,
  type RevenueStatsResponse,
  type StatsQueryParams,
  type UsersStatsResponse,
} from "@/types/api/stats";

export const statsApi = {
  films: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<FilmsStatsResponse>("/dashboard/stats/films", { params, accessToken }),

  revenue: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<RevenueStatsResponse>("/dashboard/stats/revenue", { params, accessToken }),

  users: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<UsersStatsResponse>("/dashboard/stats/users", { params, accessToken }),

  pub: (params?: StatsQueryParams, accessToken?: string) =>
    apiRequest<PubStatsResponse>("/dashboard/stats/pub", { params, accessToken }),

  pubDetail: (id: string, accessToken?: string) =>
    apiRequest<PubStatsDetail>(`/dashboard/stats/pub/${id}`, { accessToken }),
};
